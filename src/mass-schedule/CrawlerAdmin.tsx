import { useCallback, useEffect, useState } from 'react'
import { Check, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  approveProposal,
  listChurches,
  listPendingProposals,
  recrawlChurch,
  rejectProposal,
} from './convexClient'
import type { Church, CrawlProposal } from './types'

export function CrawlerAdmin() {
  const [churches, setChurches] = useState<Church[]>([])
  const [proposals, setProposals] = useState<CrawlProposal[]>([])
  const [crawlingId, setCrawlingId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    listChurches()
      .then(setChurches)
      .catch(() => {})
    listPendingProposals()
      .then(setProposals)
      .catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleRecrawl = useCallback(
    async (churchId: string) => {
      setCrawlingId(churchId)
      setError(null)
      try {
        await recrawlChurch(churchId)
        refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Crawl thất bại')
      } finally {
        setCrawlingId(null)
      }
    },
    [refresh],
  )

  const handleApprove = useCallback(
    async (proposal: CrawlProposal) => {
      setError(null)
      try {
        const draft = drafts[proposal._id]
        await approveProposal(proposal._id, draft ? JSON.parse(draft) : undefined)
        refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Duyệt đề xuất thất bại')
      }
    },
    [drafts, refresh],
  )

  const handleReject = useCallback(
    async (proposalId: string) => {
      setError(null)
      try {
        await rejectProposal(proposalId)
        refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Từ chối đề xuất thất bại')
      }
    },
    [refresh],
  )

  const churchesWithSource = churches.filter((c) => c.sourceUrl)

  return (
    <div className="flex w-full flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">
            Crawl dữ liệu nhà thờ ({churchesWithSource.length} có sourceUrl)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {churchesWithSource.map((c) => (
            <div key={c._id} className="flex items-center justify-between gap-2 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">{c.sourceUrl}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={crawlingId === c._id}
                onClick={() => handleRecrawl(c._id)}
                className="shrink-0 gap-1.5"
              >
                <RefreshCw className={`size-3.5 ${crawlingId === c._id ? 'animate-spin' : ''}`} />
                Crawl lại
              </Button>
            </div>
          ))}
          {error && <p className="text-xs text-destructive">{error}</p>}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Đề xuất đang chờ duyệt ({proposals.length})</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {proposals.length === 0 && (
            <p className="text-sm text-muted-foreground">Không có đề xuất nào đang chờ.</p>
          )}
          {proposals.map((p) => (
            <div key={p._id} className="flex flex-col gap-2 rounded-md border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">{p.churchName}</p>
                <Badge variant="secondary">{new Date(p.fetchedAt).toLocaleString('vi-VN')}</Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">{p.sourceUrl}</p>

              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer">
                  Văn bản trích từ trang ({p.excerpt.length} ký tự)
                </summary>
                <p className="mt-1 max-h-48 overflow-y-auto whitespace-pre-wrap">{p.excerpt}</p>
              </details>

              <label className="flex flex-col gap-1 text-xs font-medium text-foreground">
                Giờ lễ đề xuất (JSON — có thể sửa trước khi duyệt)
                <Textarea
                  defaultValue={JSON.stringify(p.proposedMassTimes, null, 2)}
                  onChange={(e) => setDrafts((d) => ({ ...d, [p._id]: e.target.value }))}
                  rows={6}
                  className="font-mono text-xs"
                />
              </label>
              {p.proposedMassTimes.length === 0 && (
                <p className="text-xs text-orange-500">
                  Không tự nhận diện được giờ lễ — đọc văn bản trích và nhập tay trước khi duyệt.
                </p>
              )}

              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleApprove(p)} className="gap-1.5">
                  <Check className="size-3.5" /> Duyệt
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(p._id)}
                  className="gap-1.5"
                >
                  <X className="size-3.5" /> Từ chối
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
