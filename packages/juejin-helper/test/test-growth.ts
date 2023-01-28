import JuejinHelper from "..";

const mockCookie = `juejin-cookies`;

async function run() {
  const juejin = new JuejinHelper();
  await juejin.login(mockCookie);
  console.log(juejin.getUser()?.user_name);

  const growth = juejin.growth();

  const status = await growth.getTodayStatus();
  console.log(`签到状态: ${status}`);
  const vipData = (await growth.getUserVIPInfo()) as any;
  const recommendArticles = (await growth.getRecommendArticles({
    limit: vipData?.user_growth_info?.vip_level !== 0 ? 5 : 1
  })) as any;
  recommendArticles.forEach((l: any) =>
    growth.readArticle(l.item_info.article_id).catch(e => {
      throw new e();
    })
  );
  const counts = await growth.getCounts();
  console.log(`连续签到天数 ${counts.cont_count}, 累计签到天数${counts.sum_count}`);

  const luckyusersResult = await growth.getLotteriesLuckyUsers();
  if (luckyusersResult.count > 0) {
    const no1LuckyUser = luckyusersResult.lotteries[0];
    const dipLuckyResult = await growth.dipLucky(no1LuckyUser.history_id);
    if (dipLuckyResult.has_dip) {
      console.log(`今天你已经沾过喜气，明天再来吧!`);
    } else {
      console.log(`沾喜气 +${dipLuckyResult.dip_value} 幸运值`);
    }
  }
}

run();
