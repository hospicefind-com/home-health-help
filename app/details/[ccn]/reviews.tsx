import SingleReview from "@/components/display-data/singleReview";
import { getNewestReviews } from "@/lib/google/get-reviews";
import { PlaceReview } from "@/lib/types";
import { StarSolid } from "iconoir-react";

export default async function GoogleReviews({ placeID }: { placeID: string }) {
  const reviews = await getNewestReviews(placeID);
  console.log(reviews);
  let sum = 0;
  reviews?.result.reviews?.map((review: PlaceReview) => sum += review.rating);

  const avgRating = sum / 5;

  return (
    <div className="container mx-auto w-full px-4 py-8 space-y-8">
      <section className="rounded-lg border border-foreground-alt bg-background text-foreground p-6">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <h2 className="font-light text-foreground-alt">Based off 5 latest reviews</h2>
        <h2 className="text-xl font-semibold mb-4 flex flex-row">
          <span>Average:</span>
          <StarSolid color="#d3d3ff" />
          <span>{avgRating}</span>
        </h2>
        {reviews?.result.reviews?.map((review: PlaceReview, index) => (
          <SingleReview review={review} key={index} />
        ))}
      </section>
    </div>
  )
}
