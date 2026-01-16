import SingleReview from "@/components/display-data/singleReview";
import { getNewestReviews } from "@/lib/google/get-reviews";
import { PlaceReview } from "@/lib/types";
import { StarSolid } from "iconoir-react";

export default async function GoogleReviews({ placeID }: { placeID: string }) {
  console.log(placeID);
  console.log("stufpiad ass fuckgin chud biafthcv");
  const reviews = await getNewestReviews(placeID);
  console.log(reviews);
  let sum = 0;
  reviews?.result.reviews?.map((review: PlaceReview) => sum += review.rating);

  const avgRating = sum / 5;

  const color = 'var(--accent)';

  return (
    <div className="">
      <section className="bg-background text-foreground mt-2">
        <h2 className="font-light text-foreground-alt">Based off 5 latest reviews</h2>
        <h2 className="text-4xl/7 font-dongle font-bold mb-4 flex flex-row items-center">
          <span>Average:</span>
          <StarSolid color={color} width="1em" height="1em" />
          <span>{avgRating}</span>
        </h2>
        {reviews?.result.reviews?.map((review: PlaceReview, index) => (
          <SingleReview review={review} key={index} />
        ))}
      </section>
    </div>
  )
}
