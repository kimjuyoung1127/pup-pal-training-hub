12:07:40 PM: build-image version: 9b5eda74bd0982ea06a6fdf058a78c4ba15c7b10 (noble)
12:07:40 PM: buildbot version: 9b5eda74bd0982ea06a6fdf058a78c4ba15c7b10
12:07:40 PM: Fetching cached dependencies
12:07:40 PM: Starting to download cache of 829.6MB (Last modified: 2025-08-20 08:49:27 +0000 UTC)
12:07:42 PM: Finished downloading cache in 2.461s
12:07:42 PM: Starting to extract cache
12:07:48 PM: Finished extracting cache in 5.821s
12:07:48 PM: Finished fetching cache in 8.358s
12:07:48 PM: Starting to prepare the repo for build
12:07:48 PM: Preparing Git Reference refs/heads/main
12:07:51 PM: Starting to install dependencies
12:07:51 PM: Started restoring cached ruby cache
12:07:52 PM: Finished restoring cached ruby cache
12:07:52 PM: Started restoring cached go cache
12:07:53 PM: Finished restoring cached go cache
12:07:53 PM: Started restoring cached Node.js version
12:07:54 PM: Finished restoring cached Node.js version
12:07:54 PM: v18.20.8 is already installed.
12:07:54 PM: Now using node v18.20.8 (npm v10.8.2)
12:07:54 PM: Enabling Node.js Corepack
12:07:54 PM: Started restoring cached build plugins
12:07:54 PM: Finished restoring cached build plugins
12:07:54 PM: Started restoring cached corepack dependencies
12:07:54 PM: Finished restoring cached corepack dependencies
12:07:54 PM: No npm workspaces detected
12:07:54 PM: Started restoring cached node modules
12:07:54 PM: Finished restoring cached node modules
12:07:54 PM: Installing npm packages using npm version 10.8.2
12:07:55 PM: up to date in 934ms
12:07:55 PM: npm packages installed
12:07:56 PM: Successfully installed dependencies
12:07:56 PM: Starting build script
12:07:56 PM: Detected 1 framework(s)
12:07:56 PM: "vite" at version "5.4.10"
12:07:56 PM: Section completed: initializing
12:07:58 PM: ​
12:07:58 PM: Netlify Build                                                 
12:07:58 PM: ────────────────────────────────────────────────────────────────
12:07:58 PM: ​
12:07:58 PM: ❯ Version
12:07:58 PM:   @netlify/build 35.1.2
12:07:58 PM: ​
12:07:58 PM: ❯ Flags
12:07:58 PM:   accountId: 684ae20e43cebbac52bbb871
12:07:58 PM:   baseRelDir: true
12:07:58 PM:   buildId: 68a68d7a3ddc1b0009038f60
12:07:58 PM:   deployId: 68a68d7a3ddc1b0009038f62
12:07:58 PM: ​
12:07:58 PM: ❯ Current directory
12:07:58 PM:   /opt/build/repo
12:07:58 PM: ​
12:07:58 PM: ❯ Config file
12:07:58 PM:   /opt/build/repo/netlify.toml
12:07:58 PM: ​
12:07:58 PM: ❯ Context
12:07:58 PM:   production
12:07:58 PM: ​
12:07:58 PM: build.command from netlify.toml                               
12:07:58 PM: ────────────────────────────────────────────────────────────────
12:07:58 PM: ​
12:07:58 PM: $ bun run build
12:07:58 PM: $ vite build
12:07:58 PM: vite v5.4.10 building for production...
12:07:59 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2 (https://ntl.fyi/exit-code-2)
12:07:59 PM: transforming...
12:07:59 PM: ✓ 76 modules transformed.
12:07:59 PM: x Build failed in 432ms
12:07:59 PM: error during build:
12:07:59 PM: [vite-plugin-pwa:build] [vite]: Rollup failed to resolve import "@mediapipe/pose" from "/opt/build/repo/src/pages/tools/RealtimePostureGuide.tsx".
12:07:59 PM: This is most likely unintended because it can break your application at runtime.
12:07:59 PM: If you do want to externalize this module explicitly add it to
12:07:59 PM: `build.rollupOptions.external`
12:07:59 PM:     at viteWarn (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:65589:17)
12:07:59 PM:     at onwarn (file:///opt/build/repo/node_modules/@vitejs/plugin-react-swc/index.mjs:206:9)
12:07:59 PM:     at onRollupWarning (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:65619:5)
12:07:59 PM:     at onwarn (file:///opt/build/repo/node_modules/vite/dist/node/chunks/dep-BWSbWtLw.js:65284:7)
12:07:59 PM:     at file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:19393:13
12:07:59 PM:     at Object.logger [as onLog] (file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:21119:9)
12:07:59 PM:     at ModuleLoader.handleInvalidResolvedId (file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:20008:26)
12:07:59 PM:     at file:///opt/build/repo/node_modules/rollup/dist/es/shared/node-entry.js:19966:26
12:07:59 PM: error: script "build" exited with code 1
12:07:59 PM: ​
12:07:59 PM: "build.command" failed                                        
12:07:59 PM: ────────────────────────────────────────────────────────────────
12:07:59 PM: ​
12:07:59 PM:   Error message
12:07:59 PM:   Command failed with exit code 1: bun run build (https://ntl.fyi/exit-code-1)
12:07:59 PM: ​
12:07:59 PM:   Error location
12:07:59 PM:   In build.command from netlify.toml:
12:07:59 PM:   bun run build
12:07:59 PM: ​
12:07:59 PM:   Resolved config
12:07:59 PM:   build:
12:07:59 PM:     command: bun run build
12:07:59 PM:     commandOrigin: config
12:07:59 PM:     environment:
12:07:59 PM:       - VITE_API_BASE_URL
12:07:59 PM:       - VITE_BOOTPAY_APPLICATION_ID
12:07:59 PM:       - VITE_GEMINI_API_KEY
12:07:59 PM:       - VITE_SUPABASE_ANON_KEY
12:07:59 PM:       - VITE_SUPABASE_URL
12:07:59 PM:       - VITE_YOUTUBE_API_KEY
12:07:59 PM:       - NODE_VERSION
12:07:59 PM:     publish: /opt/build/repo/dist
12:07:59 PM:     publishOrigin: config
12:07:59 PM:   redirects:
12:07:59 PM:     - from: /*
      status: 200
      to: /index.html
  redirectsOrigin: config
12:07:59 PM: Build failed due to a user error: Build script returned non-zero exit code: 2
12:07:59 PM: Failing build: Failed to build site
12:08:00 PM: Finished processing build request in 19.953s