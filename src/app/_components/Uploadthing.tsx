"use client"

import { generateComponents } from "@uploadthing/react"
import type { OurFileRouter } from "~/app/api/uploadthing/core"
import React from "react"
import toast from "react-hot-toast"
import { api } from "~/trpc/react"
import { useNavContext } from "../context/NavContext"

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>()

export default function uploadthing() {
  const utils = api.useUtils()
  const { setTab } = useNavContext()
  const { mutate } = api.file.createRecord.useMutation({
    onSuccess: async () => {
      utils.file.getAll.invalidate()
      toast.success("Upload Completed", { id: "upload file" })
      setTab("file")
    },
  })

  return (
    <UploadDropzone
      className="cursor-pointer"
      endpoint="fileUploader"
      onClientUploadComplete={(res) => {
        // console.log("Files: ", res)

        if (!res) return
        for (const item of res) {
          const { name, url, size, key } = item
          mutate({ name, url, size, key })
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(`ERROR! ${error.message}`)
      }}
    />
  )
}
