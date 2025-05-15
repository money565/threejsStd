import { defineConfig, loadEnv } from 'vite'
import alias from './vite/alias'
import setupVitePlugins from './vite/plugins/index'
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // eslint-disable-next-line node/prefer-global/process
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: setupVitePlugins(env, command === 'build'),
    resolve: {
      alias,
    },
  }
})
