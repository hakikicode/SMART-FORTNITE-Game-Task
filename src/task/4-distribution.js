const SLASH_PERCENT = 0.7;

export function distribution(submitters, bounty, roundNumber) {
  const distributionList = {};
  const approvedSubmitters = [];

  for (const submitter of submitters) {
    if (submitter.votes > 0) {
      approvedSubmitters.push(submitter.publicKey);
    } else if (submitter.votes < 0) {
      const slashedStake = Math.floor(submitter.stake * SLASH_PERCENT);
      distributionList[submitter.publicKey] = -slashedStake;
      console.log("Stake slashed for:", submitter.publicKey);
    }
  }

  const reward = Math.floor(bounty / approvedSubmitters.length);
  approvedSubmitters.forEach(candidate => {
    distributionList[candidate] = reward;
  });

  return distributionList;
}
