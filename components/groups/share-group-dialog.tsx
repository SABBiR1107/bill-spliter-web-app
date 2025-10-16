"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Copy, Check } from "lucide-react"
import QRCode from "qrcode"
import { useEffect, useRef } from "react"

interface ShareGroupDialogProps {
  inviteCode: string
  groupName: string
}

export function ShareGroupDialog({ inviteCode, groupName }: ShareGroupDialogProps) {
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const joinUrl = `${window.location.origin}/groups/join?code=${inviteCode}`
      QRCode.toCanvas(canvasRef.current, joinUrl, {
        width: 200,
        margin: 2,
      })
    }
  }, [inviteCode])

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to {groupName}</DialogTitle>
          <DialogDescription>Share this code or QR with your friends to join the group</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Invite code</Label>
            <div className="flex gap-2">
              <Input value={inviteCode} readOnly className="text-center text-2xl font-mono tracking-widest" />
              <Button size="icon" variant="outline" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>QR Code</Label>
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
