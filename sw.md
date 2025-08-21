12:46:03 PM: build-image version: 9b5eda74bd0982ea06a6fdf058a78c4ba15c7b10 (noble)
12:46:03 PM: buildbot version: 9b5eda74bd0982ea06a6fdf058a78c4ba15c7b10
12:46:05 PM: Fetching cached dependencies
12:46:05 PM: Starting to download cache of 904.5MB (Last modified: 2025-08-21 03:27:24 +0000 UTC)
12:46:07 PM: Finished downloading cache in 2.488s
12:46:07 PM: Starting to extract cache
12:46:35 PM: Finished extracting cache in 27.767s
12:46:35 PM: Finished fetching cache in 30.343s
12:46:35 PM: Starting to prepare the repo for build
12:46:35 PM: Preparing Git Reference refs/heads/main
12:46:38 PM: Starting to install dependencies
12:46:38 PM: Started restoring cached python cache
12:46:38 PM: Finished restoring cached python cache
12:46:38 PM: Started restoring cached ruby cache
12:46:39 PM: Finished restoring cached ruby cache
12:46:39 PM: Started restoring cached go cache
12:46:39 PM: Finished restoring cached go cache
12:46:40 PM: Started restoring cached Node.js version
12:46:41 PM: Finished restoring cached Node.js version
12:46:41 PM: v18.20.8 is already installed.
12:46:41 PM: Now using node v18.20.8 (npm v10.8.2)
12:46:41 PM: Enabling Node.js Corepack
12:46:41 PM: Started restoring cached build plugins
12:46:41 PM: Finished restoring cached build plugins
12:46:41 PM: Started restoring cached corepack dependencies
12:46:41 PM: Finished restoring cached corepack dependencies
12:46:41 PM: No npm workspaces detected
12:46:41 PM: Started restoring cached node modules
12:46:41 PM: Finished restoring cached node modules
12:46:41 PM: Installing npm packages using npm version 10.8.2
12:46:42 PM: removed 3 packages in 777ms
12:46:42 PM: npm packages installed
12:46:42 PM: Successfully installed dependencies
12:46:42 PM: Starting build script
12:46:43 PM: Detected 1 framework(s)
12:46:43 PM: "vite" at version "5.4.10"
12:46:43 PM: Section completed: initializing
12:46:44 PM: ​
12:46:44 PM: Netlify Build                                                 
12:46:44 PM: ────────────────────────────────────────────────────────────────
12:46:44 PM: ​
12:46:44 PM: ❯ Version
12:46:44 PM:   @netlify/build 35.1.2
12:46:44 PM: ​
12:46:44 PM: ❯ Flags
12:46:44 PM:   accountId: 684ae20e43cebbac52bbb871
12:46:44 PM:   baseRelDir: true
12:46:44 PM:   buildId: 68a696777161160008a3a511
12:46:44 PM:   deployId: 68a696777161160008a3a513
12:46:44 PM: ​
12:46:44 PM: ❯ Current directory
12:46:44 PM:   /opt/build/repo
12:46:44 PM: ​
12:46:44 PM: ❯ Config file
12:46:44 PM:   /opt/build/repo/netlify.toml
12:46:44 PM: ​
12:46:44 PM: ❯ Context
12:46:44 PM:   production
12:46:44 PM: ​
12:46:44 PM: build.command from netlify.toml                               
12:46:44 PM: ────────────────────────────────────────────────────────────────
12:46:44 PM: ​
12:46:44 PM: $ bun run build
12:46:44 PM: $ vite build
12:46:45 PM: vite v5.4.10 building for production...
12:46:45 PM: transforming...
12:46:45 PM: ✓ 76 modules transformed.
12:46:45 PM: x Build failed in 421ms
12:46:45 PM: error during build:
12:46:45 PM: [vite-plugin-pwa:build] [vite]: Rollup failed to resolve import "@mediapipe/tasks-vision" from "/opt/build/repo/src/pages/tools/RealtimePostureGuide.tsx".
12:46:45 PM: This is most likely unintended because it can break your application at runtime.
12:46:45 PM: If you do want to externalize this module explicitly add it to
12:46:45 PM: `build.rollupOptions.external`
12:46:45 PM:     at viteWarn (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:65589:17)
12:46:45 PM:     at onwarn (file:///opt/build/repo/node_modules/@vitejs/plugin-react-swc/index.mjs:206:9)
12:46:45 PM:     at onRollupWarning (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:65619:5)
12:46:45 PM:     at onwarn (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:65284:7)
12:46:45 PM:     at file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:19393:13
12:46:45 PM:     at Object.logger [as onLog] (file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:21119:9)
12:46:45 PM:     at ModuleLoader.handleInvalidResolvedId (file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:20008:26)
12:46:45 PM:     at file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:19966:26
12:46:45 PM: error: script "build" exited with code 1
12:46:45 PM: ​
12:46:45 PM: "build.command" failed                                        
12:46:45 PM: ────────────────────────────────────────────────────────────────
12:46:45 PM: ​
12:46:45 PM:   Error message
12:46:45 PM:   Command failed with exit code 1: bun run build (https://ntl.fyi/exit-code-1)
12:46:45 PM: ​
12:46:45 PM:   Error location
12:46:45 PM:   In build.command from netlify.toml:
12:46:45 PM:   bun run build
12:46:45 PM: ​
12:46:45 PM:   Resolved config
12:46:45 PM:   build:
12:46:45 PM:     command: bun run build
12:46:45 PM:     commandOrigin: config
12:46:45 PM:     environment:
12:46:45 PM:       - VITE_API_BASE_URL
12:46:45 PM:       - VITE_BOOTPAY_APPLICATION_ID
12:46:45 PM:       - VITE_GEMINI_API_KEY
12:46:45 PM:       - VITE_SUPABASE_ANON_KEY
12:46:45 PM:       - VITE_SUPABASE_URL
12:46:45 PM:       - VITE_YOUTUBE_API_KEY
12:46:45 PM:       - NODE_VERSION
12:46:45 PM:     publish: /opt/build/repo/dist
12:46:45 PM:     publishOrigin: config
12:46:45 PM:   redirects:
12:46:45 PM:     - from: /*
      status: 200
      to: /index.html
  redirectsOrigin: config
12:46:45 PM: Build failed due to a user error: Build script returned non-zero exit code: 2
12:46:45 PM: Failing build: Failed to build site
12:46:46 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2 (https://ntl.fyi/exit-code-2)
12:46:46 PM: Finished processing build request in 42.373s