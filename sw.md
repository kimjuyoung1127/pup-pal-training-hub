12:39:25 PM: build-image version: 9b5eda74bd0982ea06a6fdf058a78c4ba15c7b10 (noble)
12:39:25 PM: buildbot version: 9b5eda74bd0982ea06a6fdf058a78c4ba15c7b10
12:39:25 PM: Fetching cached dependencies
12:39:25 PM: Starting to download cache of 904.5MB (Last modified: 2025-08-21 03:27:24 +0000 UTC)
12:39:28 PM: Finished downloading cache in 3.149s
12:39:28 PM: Starting to extract cache
12:39:33 PM: Finished extracting cache in 4.735s
12:39:33 PM: Finished fetching cache in 8.008s
12:39:33 PM: Starting to prepare the repo for build
12:39:33 PM: Preparing Git Reference refs/heads/main
12:39:35 PM: Starting to install dependencies
12:39:35 PM: Started restoring cached python cache
12:39:35 PM: Finished restoring cached python cache
12:39:35 PM: Started restoring cached ruby cache
12:39:35 PM: Finished restoring cached ruby cache
12:39:36 PM: Started restoring cached go cache
12:39:36 PM: Finished restoring cached go cache
12:39:37 PM: Started restoring cached Node.js version
12:39:37 PM: Finished restoring cached Node.js version
12:39:37 PM: v18.20.8 is already installed.
12:39:37 PM: Now using node v18.20.8 (npm v10.8.2)
12:39:38 PM: Enabling Node.js Corepack
12:39:38 PM: Started restoring cached build plugins
12:39:38 PM: Finished restoring cached build plugins
12:39:38 PM: Started restoring cached corepack dependencies
12:39:38 PM: Finished restoring cached corepack dependencies
12:39:38 PM: No npm workspaces detected
12:39:38 PM: Started restoring cached node modules
12:39:38 PM: Finished restoring cached node modules
12:39:38 PM: Installing npm packages using npm version 10.8.2
12:39:39 PM: up to date in 1s
12:39:39 PM: npm packages installed
12:39:39 PM: Successfully installed dependencies
12:39:39 PM: Starting build script
12:39:40 PM: Detected 1 framework(s)
12:39:40 PM: "vite" at version "5.4.10"
12:39:40 PM: Section completed: initializing
12:39:41 PM: ​
12:39:41 PM: Netlify Build                                                 
12:39:41 PM: ────────────────────────────────────────────────────────────────
12:39:41 PM: ​
12:39:41 PM: ❯ Version
12:39:41 PM:   @netlify/build 35.1.2
12:39:41 PM: ​
12:39:41 PM: ❯ Flags
12:39:41 PM:   accountId: 684ae20e43cebbac52bbb871
12:39:41 PM:   baseRelDir: true
12:39:41 PM:   buildId: 68a694d01e3229000836fc8d
12:39:41 PM:   deployId: 68a694d01e3229000836fc8f
12:39:41 PM: ​
12:39:41 PM: ❯ Current directory
12:39:41 PM:   /opt/build/repo
12:39:41 PM: ​
12:39:41 PM: ❯ Config file
12:39:41 PM:   /opt/build/repo/netlify.toml
12:39:41 PM: ​
12:39:41 PM: ❯ Context
12:39:41 PM:   production
12:39:41 PM: ​
12:39:41 PM: build.command from netlify.toml                               
12:39:41 PM: ────────────────────────────────────────────────────────────────
12:39:41 PM: ​
12:39:41 PM: $ bun run build
12:39:42 PM: $ vite build
12:39:42 PM: vite v5.4.10 building for production...
12:39:42 PM: transforming...
12:39:42 PM: ✓ 63 modules transformed.
12:39:42 PM: x Build failed in 441ms
12:39:42 PM: error during build:
12:39:42 PM: [vite-plugin-pwa:build] [vite]: Rollup failed to resolve import "@mediapipe/tasks-vision" from "/opt/build/repo/src/pages/tools/RealtimePostureGuide.tsx".
12:39:42 PM: This is most likely unintended because it can break your application at runtime.
12:39:42 PM: If you do want to externalize this module explicitly add it to
12:39:42 PM: `build.rollupOptions.external`
12:39:42 PM:     at viteWarn (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:65589:17)
12:39:42 PM:     at onwarn (file:///opt/build/repo/node_modules/@vitejs/plugin-react-swc/index.mjs:206:9)
12:39:42 PM:     at onRollupWarning (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:65619:5)
12:39:42 PM:     at onwarn (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:65284:7)
12:39:42 PM:     at file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:19393:13
12:39:42 PM:     at Object.logger [as onLog] (file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:21119:9)
12:39:42 PM:     at ModuleLoader.handleInvalidResolvedId (file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:20008:26)
12:39:42 PM:     at file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:19966:26
12:39:42 PM: error: script "build" exited with code 1
12:39:42 PM: ​
12:39:42 PM: "build.command" failed                                        
12:39:42 PM: ────────────────────────────────────────────────────────────────
12:39:42 PM: ​
12:39:42 PM:   Error message
12:39:42 PM:   Command failed with exit code 1: bun run build
12:39:42 PM: ​
12:39:42 PM:   Error location
12:39:42 PM:   In build.command from netlify.toml:
12:39:42 PM:   bun run build
12:39:42 PM: ​
12:39:42 PM:   Resolved config
12:39:42 PM:   build:
12:39:42 PM:     command: bun run build
12:39:42 PM:     commandOrigin: config
12:39:42 PM:     environment:
12:39:42 PM:       - VITE_API_BASE_URL
12:39:42 PM:       - VITE_BOOTPAY_APPLICATION_ID
12:39:42 PM:       - VITE_GEMINI_API_KEY
12:39:42 PM:       - VITE_SUPABASE_ANON_KEY
12:39:42 PM:       - VITE_SUPABASE_URL
12:39:42 PM:       - VITE_YOUTUBE_API_KEY
12:39:42 PM:       - NODE_VERSION
12:39:42 PM:     publish: /opt/build/repo/dist
12:39:42 PM:     publishOrigin: config
12:39:42 PM:   redirects:
12:39:43 PM:     - from: /*
      status: 200
      to: /index.html
  redirectsOrigin: config
12:39:43 PM: Build failed due to a user error: Build script returned non-zero exit code: 2
12:39:43 PM: Failing build: Failed to build site
12:39:43 PM: Finished processing build request in 18.3s
12:39:43 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2