import {
  CopyIcon,
  RotateCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/patina/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/patina/ui/bubble"
import { Button } from "@/patina/ui/button"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/patina/ui/message"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Message",
  description:
    "One turn in a conversation: who wrote it and when, what they said, and what can be done with it.",
  item: "message",
  group: "Conversation",
}

function Byline({ name, time }: { name: string; time: string }) {
  return (
    <MessageHeader>
      <b>{name}</b>
      <time dateTime={`2026-11-14T${time}`}>{time}</time>
    </MessageHeader>
  )
}

function Who({ name, initials }: { name: string; initials: string }) {
  return (
    <MessageAvatar>
      <Avatar>
        <AvatarFallback name={name}>{initials}</AvatarFallback>
      </Avatar>
    </MessageAvatar>
  )
}

const ACTIONS = [
  { label: "Copy", icon: CopyIcon },
  { label: "Good answer", icon: ThumbsUpIcon },
  { label: "Not right", icon: ThumbsDownIcon },
  { label: "Ask again", icon: RotateCcwIcon },
]

export default function MessageDemo() {
  return (
    <>
      <DemoSection title="A note each way">
        <MessageGroup className="max-w-[40rem] gap-snug">
          <Message align="end">
            <Who name="Mira Okafor" initials="MO" />
            <MessageContent>
              <Byline name="Mira Okafor" time="16:52" />
              <Bubble>
                <BubbleContent>
                  Small, brown, streaky, flicking its tail in the reed bed at
                  dusk. Gone before I got the bins on it. Any idea?
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <Who name="Fieldbook" initials="FB" />
            <MessageContent>
              <Byline name="Fieldbook" time="16:52" />
              <Bubble variant="ghost">
                <BubbleContent>
                  Three warblers fit a small brown bird in reeds: sedge, reed
                  and Cetti&rsquo;s. The date does most of the work. Sedge and
                  reed warblers left for Africa weeks ago, and Cetti&rsquo;s
                  stays all winter.
                </BubbleContent>
              </Bubble>
              <MessageFooter className="-ms-2.5">
                {ACTIONS.map(({ label, icon: Icon }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon-sm"
                    aria-label={label}
                    className="text-ink-2"
                  >
                    <Icon />
                  </Button>
                ))}
              </MessageFooter>
            </MessageContent>
          </Message>
        </MessageGroup>
      </DemoSection>
      <DemoSection title="Several slips, one note">
        <Message align="end" className="max-w-[40rem]">
          <Who name="Mira Okafor" initials="MO" />
          <MessageContent>
            <Byline name="Mira Okafor" time="16:53" />
            <BubbleGroup>
              <Bubble>
                <BubbleContent>It called once.</BubbleContent>
              </Bubble>
              <Bubble>
                <BubbleContent>
                  Really loud, sudden, from deep in the reeds. I got the end of
                  it on my phone.
                </BubbleContent>
              </Bubble>
            </BubbleGroup>
            <MessageFooter>Read 16:53</MessageFooter>
          </MessageContent>
        </Message>
      </DemoSection>
      <DemoSection title="Without avatars">
        <MessageGroup className="max-w-[40rem] gap-snug">
          <Message>
            <MessageContent>
              <Byline name="Tomas Lund" time="17:04" />
              <Bubble variant="secondary">
                <BubbleContent>
                  Heard one by the sluice gate on Thursday too.
                </BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message align="end">
            <MessageContent>
              <Byline name="Mira Okafor" time="17:06" />
              <Bubble>
                <BubbleContent>So there are two of them now.</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </MessageGroup>
      </DemoSection>
    </>
  )
}
