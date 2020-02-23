import { post } from '@/lin/plugins/axios'
// eslint-disable-next-line
export async function customImageUpload(file) {
  const res = await post('cms/file/image', { file })
  for (let i = 0; i < res.length; i++) {
    // 固定用法，返回一个promise
    return Promise.resolve({
      id: res[i].id,
      url: res[i].url,
    })
  }
  return res
}
