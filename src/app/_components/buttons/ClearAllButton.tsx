"use client"

import React, { useEffect, useState } from "react"
import { api } from "~/trpc/react"
import toast from "react-hot-toast"
import { useAutoAnimate } from "@formkit/auto-animate/react"

import useParamId from "~/app/hooks/useParamId"
import { useNavContext } from "~/app/context/NavContext"
import { useBoardContext } from "~/app/context/BoardContext"

import { MdCancel, MdCheckCircle } from "react-icons/md"

export default function ClearAllButton() {
  const utils = api.useUtils()

  const [animationParent] = useAutoAnimate()
  const boardId = useParamId()

  const { locked } = useBoardContext()
  const { tab } = useNavContext()

  const [pending, setPending] = useState(false)

  const { mutate: deleteAllText } = api.text.deleteAll.useMutation({
    onSuccess: () => {
      utils.text.getAll.invalidate()
      toast.success("Cleared all texts!", { id: "clear all" })
      setPending(false)
    },
    onMutate: () => {
      toast.loading("Deleting all", { id: "clear all" })
    },
  })

  const { mutate: deleteAllFile } = api.file.deleteAll.useMutation({
    onSuccess: () => {
      utils.file.getAll.invalidate()
      toast.success("Cleared all files!", { id: "clear all" })
      setPending(false)
    },
    onMutate: () => {
      toast.loading("Deleting all", { id: "clear all" })
    },
  })

  useEffect(() => {
    setPending(false)
  }, [tab])

  const mutate = tab === "text" ? deleteAllText : deleteAllFile

  if (locked) return <></>

  return (
    <div ref={animationParent} className="flex w-full justify-center gap-2 p-4">
      {!pending && (
        <button
          className="grow select-none rounded-xl border border-red-500 p-2 transition hover:bg-red-500 active:translate-y-[2px] disabled:opacity-50"
          onClick={() => setPending(true)}
        >
          Clear All
        </button>
      )}
      {pending && (
        <>
          <button
            className="flex grow select-none items-center justify-center gap-1 rounded-xl border border-blue-500 p-2 transition hover:bg-blue-500 active:translate-y-[2px]"
            onClick={() => setPending(false)}
          >
            Cancel <MdCancel size={20} />
          </button>
          <button
            className="flex grow items-center justify-center gap-1 rounded-xl border border-red-500 p-2 transition hover:bg-red-500 active:translate-y-[2px]"
            onClick={() => mutate({ boardId })}
          >
            Delete <MdCheckCircle size={20} />
          </button>
        </>
      )}
    </div>
  )
}
