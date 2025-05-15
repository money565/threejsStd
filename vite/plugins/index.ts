import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import setupAutoImport from './auto-import'
import setupComponents from './components'
import setupExtendPlus from './extend-plus'
import setupSvgIcon from './svg-icon'

export default function setupVitePlugins(env: Record<string, string>, isBuild: boolean) {
  const plugins: PluginOption[] = [UnoCSS(), vue(), vueJsx(), vueDevTools()]
  plugins.push(setupAutoImport())
  plugins.push(setupComponents())
  plugins.push(setupExtendPlus())
  plugins.push(setupSvgIcon(isBuild))
  return plugins
}
