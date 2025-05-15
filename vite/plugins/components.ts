import components from 'unplugin-vue-components/vite'

export default function setupComponents() {
  return components({
    dirs: ['src/components'],
    include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
    dts: 'types/components.d.ts',
  })
}
