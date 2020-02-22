import { post } from '@/lin/plugins/axios'

export async function customImageUpload(file) {
  const res = await post('cms/file/image', { file })
  return res
}
