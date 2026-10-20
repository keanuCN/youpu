# Fischer RC4 Worldcup Noize SL 数据补充（2026-10-20）

## 本批核验

依据 Fischer 美国官方商品页和 Fischer Japan 26/27 官方目录，分别新增 RC4 Worldcup Noize SL Men M-Plate（A04026）与 Women M-Plate（A04626）两款双板。Men 提供 165 cm、12 m；Women 提供 155/158 cm，官方目录按尺码顺序列半径 10.9/11.4 m。两款均标注 FIS Standard、专家级竞赛取向，结构包括 Race Code、M-Plate、实木芯和 Noize Control；雪刃角按官方目录记录。

日本目录列不含固定器双板价 JPY 187,000，另列含固定器套装价 JPY 242,000。按 ECB 2026-10-19 EUR/JPY 177.63、EUR/CNY 7.4991 换算，不含固定器双板价约 CNY 7,894.68，作为日本地区参考而非中国售价。美国官网同时显示 USD 1,299（未含税费和运费）；该地区页面没有明确固定器是否包含，因此没有把两地价格配置直接等同。

官方来源未给出男款板型三围和两款可比重量；女款商品页显示 115.4-66.01-100.7 mm，但未说明对应 155 或 158 cm，故不作为逐尺码参数。主图 URL 均返回 HTTP 200，图片展示授权仍待核。官网未显示可用于本站的真实用户评分；站内评分与实测数保持真实空值，未造编辑评分或示例实测。

逐项证据、访问日期和缺口见[原始审计记录](../data/raw/skis/fischer-rc4-worldcup-noize-sl-2026-27.json)及[Men 商品种子](../data/skis/fischer-rc4-worldcup-noize-sl-men-m-plate-2027.yaml)、[Women 商品种子](../data/skis/fischer-rc4-worldcup-noize-sl-women-m-plate-2027.yaml)。

## 数据校验

运行 `pnpm --filter @youpu/api validate:data` 后，本批双板字段未报告错误；全库仍有 16 处既有契约错误，均来自运动相机和电竞键盘种子中的 `priceSource` / `priceStatus` 字段未在对应类目 schema 声明。因此整库校验仍以失败退出，不能报告为全库通过。
