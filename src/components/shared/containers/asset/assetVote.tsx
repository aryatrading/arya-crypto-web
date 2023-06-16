import { FC, useCallback, useEffect, useState } from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { useAuthUser } from "next-firebase-auth";

import { Col, Row } from "../../layout/flex";
import { ShadowButton } from "../../buttons/shadow_button";
import { getAsset } from "../../../../services/redux/assetSlice";
import {
  castVote,
  getAssetVotes,
} from "../../../../services/controllers/asset";
import { VotingComposition } from "../../asset-voting/voting-composition";

const AssetVote: FC<{ className?: string }> = ({ className }) => {
  const asset = useSelector(getAsset);
  const { t } = useTranslation(["asset"]);
  const { id } = useAuthUser();
  const [hasVoted, setHasVoted] = useState(false);
  const [votingValues, setVotingValues] = useState({
    bullish: 0,
    bearish: 0,
  });

  const initBearishAndBullishVoting = useCallback(() => {
    if (asset?.id && id != null) {
      alert('xx');
      getAssetVotes(asset.id).then((response) => {
        setHasVoted(response.user_voted_last_24h ?? false);
        setVotingValues({
          bullish: response.bullish_percentage,
          bearish: response.bearish_percentage,
        });
      });
    }
  }, [asset.id, id]);

  useEffect(() => {
    initBearishAndBullishVoting();
  }, [initBearishAndBullishVoting]);

  const onVotePress = async (vote: string) => {
    try {
      let response = await castVote(vote, asset?.id);
      setHasVoted(true);
      setVotingValues({
        ...votingValues,
        bearish: response.bearish_percentage,
        bullish: response.bullish_percentage,
      });
    } catch (error) {
      toast.error(t("error_voting"));
    }
  };

  return (
    <Col className={twMerge('gap-3 w-full md:w-full max-w-[284px]', className)}>
      <p className="font-medium text-sm">
        {hasVoted
          ? `${asset?.symbol?.toUpperCase()} ${t("assetvoted")}`
          : t("assetvoting")}
      </p>
      {hasVoted === false ? (
        <>
          <Row className="gap-2">
            <ShadowButton
              title="Bullish"
              bgColor="bg-green-2"
              onClick={() => onVotePress("bullish")}
              textColor="text-green-1"
              border="rounded-md"
              className="w-full md:w-auto"
              iconSvg={
                <ArrowTrendingUpIcon className="h-6 w-6 stroke-green-1" />
              }
              disabled={id == null}
            />
            <ShadowButton
              title="Bearish"
              bgColor="bg-red-2"
              onClick={() => onVotePress("bearish")}
              textColor="text-red-1"
              border="rounded-md"
              className="w-full md:w-auto"
              iconSvg={
                <ArrowTrendingDownIcon className="h-6 w-6 stroke-red-1" />
              }
              disabled={id == null}
            />
          </Row>
          <p className="text-grey-1 text-xs">{t("vote")}</p>{" "}
        </>
      ) : (
        <VotingComposition
          votes={[votingValues.bullish, votingValues.bearish]}
        />
      )}
    </Col>
  );
};

export default AssetVote;
