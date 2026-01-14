import { EnrichedProviderMeasure } from "@/lib/types";
import { Meter } from "@base-ui-components/react";
import { InfoCircle } from "iconoir-react";
import Popout from "../base-ui/popout";
import { getFootnote } from "../../lib/footnote";


interface StatisticProps {
  measure: EnrichedProviderMeasure,
  compare?: "stateAverage" | "nationalAverage",
}

export default function Statistic({ measure, compare }: StatisticProps) {
  // Check if score is yes/no or numeric
  const isYesNo = measure.out_of === "yes/no";
  const printScore = measure.out_of === "N/A";
  const isNumeric = !isNaN(parseFloat(measure.score)) && isFinite(parseFloat(measure.score));

  // Parse the score to get percentage value (only for numeric scores)
  const percentage = isNumeric ? parseFloat(measure.score) : 0;
  let compPercentage: number | undefined;
  let diff: number | undefined;
  const maxValue = measure.out_of === "10" ? 10 : 100;

  if (compare && measure.nationalAverage && compare === "nationalAverage") {
    compPercentage = parseFloat(measure.nationalAverage);
    if (isNumeric) {
      diff = parseFloat((percentage - compPercentage).toFixed(1));
    }
  }
  else if (compare && measure.stateAverage && compare === "stateAverage") {
    compPercentage = parseFloat(measure.stateAverage);
    if (isNumeric) {
      diff = parseFloat((percentage - compPercentage).toFixed(1));
    }
  }

  // For non-numeric values (yes/no, not available, etc.), display without meter
  if (!isNumeric || printScore) {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className="">{measure.real_desc ? measure.real_desc : measure.measureCode}</span>
          <Popout description={measure.measureName ? measure.measureName : measure.measureCode}>
            <InfoCircle color="grey" height={15} />
          </Popout>
          <span className={`flex-1 text-right font-semibold ${isYesNo || printScore ? 'capitalize' : 'text-foreground-alt italic'}`}>
            {measure.score}
          </span>
          {measure.footnote &&
            <Popout description={getFootnote(measure.footnote)}>
              <span className="text-accent underline">{measure.footnote}</span>
            </Popout>
          }
        </div>
        {compPercentage &&
          <p className="text-sm text-foreground-alt mt-1">{compare}: {compPercentage}%</p>
        }
      </div>
    );
  }

  return (
    <Meter.Root value={percentage} max={maxValue} format={{ maximumFractionDigits: 1 }}>
      <div className="flex">
        <Meter.Label id={measure.measureCode} className="">{measure.real_desc ? measure.real_desc : measure.measureCode}</Meter.Label>
        <Popout description={measure.measureName ? measure.measureName : measure.measureCode}>
          <InfoCircle color="grey" height={15} />
        </Popout>
        <Meter.Value className="flex-1 text-right" />
        {compPercentage && diff !== undefined &&
          (diff >= 0 ?
            <span className="text-foreground-alt">(+{diff}%)</span> :
            <span className="text-foreground-alt">({diff}%)</span>
          )
        }
      </div>
      <Meter.Track className="bg-foreground-alt h-2 rounded-full">
        {diff && diff < 0 ?
          <Meter.Indicator className="bg-warning rounded-full" /> :
          <Meter.Indicator className="bg-good rounded-full" />
        }
      </Meter.Track>
      {compPercentage &&
        <p className="text-foreground-alt">{compare}: {compPercentage}%</p>
      }
    </Meter.Root>
  )
}
