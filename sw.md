 ​
12:36:55 PM: $ bun run build
12:36:55 PM: $ vite build
12:36:55 PM: vite v5.4.10 building for production...
12:36:55 PM: transforming...
12:36:56 PM: ✓ 68 modules transformed.
12:36:56 PM: x Build failed in 490ms
12:36:56 PM: error during build:
12:36:56 PM: [vite-plugin-pwa:build] Transform failed with 1 error:
12:36:56 PM: /opt/build/repo/src/pages/tools/RealtimePostureGuide.tsx:140:14: ERROR: Unexpected closing "AlerDescription" tag does not match opening "AlertDescription" tag
12:36:56 PM: file: /opt/build/repo/src/pages/tools/RealtimePostureGuide.tsx:140:14
12:36:56 PM: 
12:36:56 PM: Unexpected closing "AlerDescription" tag does not match opening "AlertDescription" tag
12:36:56 PM: 138|              <AlertDescription className="!text-blue-700">
12:36:56 PM: 139|                AI가 실시간으로 강아지의 자세를 인식합니다. 아래 가이드에 따라 강아지를 위치시켜주세요.
12:36:56 PM: 140|              </AlerDescription>
12:36:56 PM:    |                ^
12:36:56 PM: 141|            </Alert>
12:36:56 PM: 142|
12:36:56 PM: 
12:36:56 PM:     at failureErrorWithLog (/opt/build/repo/node_modules/esbuild/lib/main.js:1472:15)
12:36:56 PM:     at /opt/build/repo/node_modules/esbuild/lib/main.js:755:50
12:36:56 PM:     at responseCallbacks.<computed> (/opt/build/repo/node_modules/esbuild/lib/main.js:622:9)
12:36:56 PM:     at handleIncomingPacket (/opt/build/repo/node_modules/esbuild/lib/main.js:677:12)
12:36:56 PM:     at Socket.readFromStdout (/opt/build/repo/node_modules/esbuild/lib/main.js:600:7)
12:36:56 PM:     at Socket.emit (node:events:517:28)
12:36:56 PM:     at addChunk (node:internal/streams/readable:368:12)
12:36:56 PM:     at readableAddChunk (node:internal/streams/readable:341:9)
12:36:56 PM:     at Readable.push (node:internal/streams/readable:278:10)
12:36:56 PM:     at Pipe.onStreamRead (node:internal/stream_base_commons:190:23)
12:36:56 PM: error: script "build" exited with code 1
12:36:56 PM: ​
12:36:56 PM: "build.command" failed                                        
12:36:56 PM: ────────────────────────────────────────────────────────────────
12:36:56 PM: ​
12:36:56 PM:   Error message
12:36:56 PM:   Command failed with exit code 1: bun run build
12:36:56 PM: ​
12:36:56 PM:   Error location
12:36:56 PM:   In build.command from netlify.toml:
12:36:56 PM:   bun run build
12:36:56 PM: ​
12:36:56 PM:   Resolved config
12:36:56 PM:   build:
12:36:56 PM:     command: bun run build
12:36:56 PM:     commandOrigin: config
12:36:56 PM:     environment:
12:36:56 PM:       - VITE_API_BASE_URL
12:36:56 PM:       - VITE_BOOTPAY_APPLICATION_ID
12:36:56 PM:       - VITE_GEMINI_API_KEY
12:36:56 PM:       - VITE_SUPABASE_ANON_KEY
12:36:56 PM:       - VITE_SUPABASE_URL
12:36:56 PM:       - VITE_YOUTUBE_API_KEY
12:36:56 PM:       - NODE_VERSION
12:36:56 PM:     publish: /opt/build/repo/dist
12:36:56 PM:     publishOrigin: config
12:36:56 PM:   redirects:
12:36:56 PM:     - from: /*
      status: 200
      to: /index.html
  redirectsOrigin: config
12:36:56 PM: Build failed due to a user error: Build script returned non-zero exit code: 2
12:36:56 PM: Failing build: Failed to build site
12:36:57 PM: Finished processing build request in 18.389s
12:36:56 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2