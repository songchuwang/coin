
import Home from "@/pages/home";
import Accelerate from "@/pages/accelerate";
import Function from "@/pages/function";
import Minister from "@/pages/minister";
import LanguagePage from "@/pages/languagePage";
import CoinBalance from "@/pages/coinBalance";
import Recharge from "@/pages/recharge";
import NewRecharge from "@/pages/newRecharge";
import NewWithdraw from "@/pages/newWithdraw";
import Withdraw from "@/pages/withdraw";
import MiningMachine from "@/pages/miningMachine";
import MyMiningMachine from "@/pages/myMiningMachine";
import SwapCurrency from "@/pages/swapCurrency";

import WithdrawRecord from "@/pages/withdrawRecord";
import UpdateAccount from "@/pages/updateAccount";
import TeamPage from "@/pages/teamPage";
import ExchangePage from "@/pages/exchangePage";
import CollectionPage from "@/pages/collectionPage";
import BillPage from "@/pages/billPage";
import TeamRecordPage from "@/pages/teamRecordPage";
import InvitePage from "@/pages/invitePage";
import IntroductionPage from "@/pages/introductionPage";
import InviteDetail from "@/pages/inviteDetail";
import InviteNewPage from "@/pages/inviteNewPage";
import LotteryRules from "@/pages/lotteryRules";
import Ranking from "@/pages/ranking";
import Wallet from "@/pages/wallet";
import LotteryPage from "@/pages/lotteryPage";
import LotteryRecords from "@/pages/lotteryRecords";

import MiningRecords from "@/pages/miningRecords";

import DevRouterPage from "@/pages/devRouterPage";
import TokenAllocationPage from "@/pages/tokenAllocationPage";
import ProblemFeedbackPage from "@/pages/problemFeedbackPage";
import Pledge from "@/pages/pledge";
import PledgeListPage from "@/pages/pledgeListPage";
import StakingRecord from "@/pages/stakingRecord";
import StakingTeamRecord from "@/pages/pledgeTeamRecord";
import NodeApplyPage from "@/pages/node/nodeApplyPage";
import NodeApplyForm from "@/pages/node/nodeApplyForm";
import NodeList from "@/pages/node/nodeList";
import NodeRecord from "@/pages/node/nodeRecord";
import NodeBuy from "@/pages/node/nodeBuy";
import NodeSearch from "@/pages/node/nodeSearch";
import RechargeRecord from "@/pages/rechargeRecord";
import SecuritySettingsPage from "@/pages/withdraw/securitySettingsPage";
import NodeStats from "@/pages/node/nodeIncome";
import NodeIncomeDetail from "@/pages/node/nodeIncomeDetail";
import NFTInvitePage from "@/pages/nftInvitePage";
import AccelerateMiningPage from "@/pages/accelerateMiningPage";
import MarketSwapPage from "@/pages/marketSwapPage";
// import Home = React.lazy()


export default [
  {
    path: '/',
    element: <Home />,
    exact: true,
    fallback: <div>Loading</div>
  },
  {
    path: '/accelerate',
    element: <Accelerate />,
  },
  {
    path: '/function',
    element: <Function />,
  },
  {
    path: '/minister',
    element: <Minister />,
  },
  {
    path: '/languagePage',
    element: <LanguagePage />
  },
  {
    path: '/coinBalance/:id',
    element: <CoinBalance />
  },
  {
    path: '/recharge',
    element: <Recharge />
  },
  {
    path: '/wallet/newRecharge',
    element: <NewRecharge />
  },
  {
    path: '/wallet/newWithdraw',
    element: <NewWithdraw />
  },
  {
    path: '/miningMachine',
    element: <MiningMachine />
  },
  {
    path: '/swapCurrency',
    element: <SwapCurrency />
  },
  {
    path: '/miningMachine/myMiningMachine',
    element: <MyMiningMachine />
  },
  {
    path: '/withdraw',
    element: <Withdraw />
  },
  {
    path: '/withdrawRecord',
    element: <WithdrawRecord />
  },
  {
    path: '/updateAccount',
    element: <UpdateAccount />
  },
  {
    path: '/teamPage',
    element: <TeamPage />
  },
  {
    path: '/exchangePage',
    element: <ExchangePage />
  },
  {
    path: '/collectionPage',
    element: <CollectionPage />
  },
  {
    path: '/billPage',
    element: <BillPage />
  },
  {
    path: '/teamRecordPage/:tag',
    element: <TeamRecordPage />
  },
  {
    path: '/invitePage',
    element: <InvitePage />
  },
  {
    path: '/introductionPage',
    element: <IntroductionPage />
  },
  {
    path: '/inviteNewPage/inviteDetail',
    element: <InviteDetail />
  },
  {
    path: '/inviteNewPage',
    element: <InviteNewPage />
  },
  {
    path: '/lotteryRules',
    element: <LotteryRules />
  },
  {
    path: '/lotteryRecords',
    element: <LotteryRecords />
  },
  {
    path: '/ranking',
    element: <Ranking />
  },
  {
    path: '/wallet',
    element: <Wallet />
  },
  {
    path: '/lotteryPage',
    element: <LotteryPage />
  },
  {
    path: '/miningRecords',
    element: <MiningRecords />
  },
  {
    path: '/devRouterPage',
    element: <DevRouterPage />
  },
  {
    path: '/tokenAllocationPage',
    element: <TokenAllocationPage />
  },
  {
    path: '/problemFeedbackPage',
    element: <ProblemFeedbackPage />
  },
  {
    path: '/pledge',
    element: <Pledge />
  },
  {
    path: '/pledgeList',
    element: <PledgeListPage />
  },
  {
    path: '/stakingRecord',
    element: <StakingRecord />
  },
  {
    path: '/stakingTeamRecord',
    element: <StakingTeamRecord />
  },
  {
    path: '/nodeApplyPage',
    element: <NodeApplyPage />
  },
  {
    path: '/nodeApplyForm',
    element: <NodeApplyForm />
  },
  {
    path: '/nodeList',
    element: <NodeList />
  },
  {
    path: '/nodeRecord',
    element: <NodeRecord />
  },
  {
    path: '/nodeBuy/:type/:id',
    element: <NodeBuy />
  },
  {
    path: '/nodeSearch/:id/:type',
    element: <NodeSearch />
  },
  {
    path: '/rechargeRecord',
    element: <RechargeRecord />
  },
  {
    path: '/securitySettingPage',
    element: <SecuritySettingsPage />
  },
  {
    path: '/nodeIncome/:nodeId',
    element: <NodeStats />
  },
  {
    path: '/nodeIncomeDetail/:nodeId/:userId',
    element: <NodeIncomeDetail />
  },
  {
    path: '/nftInvitePage/:type/:nftId',
    element: <NFTInvitePage />
  },
  {
    path: '/accelerateMiningPage',
    element: <AccelerateMiningPage />
  },
  {
    path: '/marketSwapPage',
    element: <MarketSwapPage />
  },
]
