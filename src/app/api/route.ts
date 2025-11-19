
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { APICodes, APIMessages, APIResponse, APIStatus } from '@/classes/APIResponses';
import { getSessionInfo } from '@/lib/checkers/session';
import { CREATE_FILEDATA } from '@/lib/database/queries/fileData';

const contentDir = path.join(process.cwd(), 'content');
const dashDir = path.join(contentDir, 'dash');
const generalDir = path.join(contentDir, 'general');
const tempPath = path.join(contentDir, 'temp');

for (const dir of [contentDir, dashDir, generalDir, tempPath]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function POST(req: NextRequest): Promise<NextResponse> {


  const session = await getSessionInfo()
  const cliTokenHeader = req.headers.get('x-cli-token');

  if ((!cliTokenHeader || cliTokenHeader != process.env.CLI_TOKEN) && (!session || session.user.role != "admin")) return new APIResponse({
    body: null,
    code: APICodes[401],
    message: APIMessages.UnAuthorized,
    status: APIStatus.Unauthorized
  }).response()


  const formData = await req.formData();
  const file = formData.get('file');
  const fileName = formData.get('name')?.toString() || '';

  const cliUpload = formData.get('cliUpload')?.toString() === 'true';
  const cliRoute = formData.get('cliRoute')?.toString() || '';

  if (!file || !(file instanceof Blob)) {


    return new APIResponse({
      body: {},
      code: APICodes[400],
      message: APIMessages.BadRequest,
      status: APIStatus.BadRequest
    }).response()
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uuid = uuidv4();
  const ext = path.extname(file.name).toLowerCase().replace('.', '');
  const mimeType = mime.lookup(file.name) || '';

  const isVideo = mimeType.startsWith('video/') || mimeType.includes('mp4');



  if (cliUpload && cliRoute) {
    const cliPath = path.join(contentDir, cliRoute);
    const partialDir = path.dirname(cliPath);

    if (partialDir && !fs.existsSync(partialDir)) {
      fs.mkdirSync(partialDir, { recursive: true });
    }

    fs.writeFileSync(cliPath, buffer);

    const fileData = await CREATE_FILEDATA({
      uuid: uuid,
      file: `/api/v1/content/${cliRoute}`,
      name: fileName,
      size: buffer.length
    })

    return new APIResponse({
      body: fileData,
      code: APICodes[200],
      message: APIMessages.OK,
      status: APIStatus.Success
    }).response();

  }

  if (isVideo) {
    const tempFilePath = path.join(tempPath, `${uuid}.${ext}`);
    fs.writeFileSync(tempFilePath, buffer);
    const outputDir = path.join(dashDir, uuid);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputManifestPath = path.join(outputDir, 'index.mpd');

    testRead(tempFilePath);
    return new Promise((resolve) => {
      ffmpeg(tempFilePath)
        .outputOptions([
          '-profile:v', 'main',
          '-keyint_min', '48',
          '-g', '48',
          '-sc_threshold', '0',
          '-b_strategy', '0',
          "-vf", "scale=1280:720",
          '-bf', '1',
          '-b:v', '1000k',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-map', '0:v:0',
          '-map', '0:a:0?',
          '-use_timeline', '1',
          '-use_template', '1',
          `-init_seg_name`, process.platform === 'win32' ? path.join(outputDir, 'init-$RepresentationID$.mp4') : 'init-$RepresentationID$.mp4',
          `-media_seg_name`, process.platform === 'win32' ? path.join(outputDir, 'chunk-$RepresentationID$-$Number%05d$.m4s') : 'chunk-$RepresentationID$-$Number%05d$.m4s',
          '-seg_duration', '4'
        ])
        .format('dash')

        .output(outputManifestPath)
        .on('end', async () => {
          fs.unlinkSync(tempFilePath);
          const fileData = await CREATE_FILEDATA({
            uuid: uuid,
            file: `/api/v1/content/dash/${uuid}/index.mpd`,
            name: fileName,
          })

          resolve(new APIResponse({
            body: fileData,
            code: APICodes[200],
            message: APIMessages.OK,
            status: APIStatus.Success
          }).response());

          clearRoute(outputManifestPath)
        })
        .on('stderr', (line) => {
          console.error('FFmpeg stderr:', line);
        })
        .on('error', (err) => {
          console.error('Error during video processing:', err);
          resolve(new APIResponse({
            body: {},
            code: APICodes[500],
            message: APIMessages.InternalServerError,
            status: APIStatus.InternalServerError
          }).response());
        })
        .run();
    });

  } else {
    const savePath = path.join(generalDir, `${uuid}.${ext}`);
    fs.writeFileSync(savePath, buffer);

    const fileData = await CREATE_FILEDATA({
      uuid: uuid,
      file: `/api/v1/content/general/${uuid}.${ext}`,
      name: fileName,
      size: buffer.length
    })

    return new APIResponse({
      body: fileData,
      code: APICodes[200],
      message: APIMessages.OK,
      status: APIStatus.Success
    }).response()
  }
}




function clearRoute(mpdPath: string): void {
  const originalContent = fs.readFileSync(mpdPath, 'utf-8');

  const modifiedContent = originalContent
    .replace(/initialization="[^"]*([\/\\]init-[^"]+)"/g, 'initialization="$1"')
    .replace(/media="[^"]*([\/\\]chunk-[^"]+)"/g, 'media="$1"');

  fs.writeFileSync(mpdPath, modifiedContent, 'utf-8');
}

async function testRead(p: string) {
  try {
    fs.readFile(p, (err, data) => {
      if (err) return console.error("Error leyendo archivo:", err);
      console.log("Archivo leído correctamente:", data.length);
    });
  } catch (e: unknown) {
    console.error('Error leyendo archivo:', (e as Error).message);
  }
}

