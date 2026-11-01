import { Typography, TypographyKicker } from "@/patina/ui/typography"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Typography",
  description:
    "A prose container that typesets plain long-form content, such as a field note or a guide, without a class on every element.",
  item: "typography",
  group: "Data display",
}

export default function TypographyDemo() {
  return (
    <DemoSection title="A field note">
      <Typography dropCap>
        <TypographyKicker>Field note · Sat 14 Nov 2026</TypographyKicker>
        <h2>The curlews came back on the falling tide</h2>
        <p>
          At first light the flats were empty, the water still high against the
          sea wall. By five the tide had turned, and the first curlews dropped
          in along the creek edge below the Sluice gate, probing the soft mud
          with those long, down-curved bills. Fourteen by half past five; the
          count held steady for the rest of the morning.
        </p>
        <p>
          The flock fed in a loose line, never more than a few metres from the
          water. When a <a href="#marsh-harrier">marsh harrier</a> came low over
          the reed bed, they lifted together, circled once and settled again
          further out.
        </p>
        <h3>What we recorded</h3>
        <ul>
          <li>Curlew, 14, feeding along the creek edge</li>
          <li>
            Redshank, 48, alarm calls when the harrier passed
            <ul>
              <li>Most of them on the near side of the channel</li>
            </ul>
          </li>
          <li>Grey heron, 1, still for eleven minutes</li>
        </ul>
        <blockquote>
          Count on the falling tide, never the rising one: the birds come to you
          as the mud opens.
        </blockquote>
        <h3>Tide at the sluice</h3>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Tide</th>
              <th>Height m</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>03:10</td>
              <td>High water</td>
              <td>6.1</td>
            </tr>
            <tr>
              <td>09:24</td>
              <td>Low water</td>
              <td>0.9</td>
            </tr>
            <tr>
              <td>15:33</td>
              <td>High water</td>
              <td>5.8</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <h4>Next time</h4>
        <ol>
          <li>Start from the Saltings gate an hour before low water.</li>
          <li>
            Log flushes with the <code>partial</code> flag so the monthly total
            stays honest.
          </li>
          <li>Bring the scope to the North hide.</li>
        </ol>
      </Typography>
    </DemoSection>
  )
}
