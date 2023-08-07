async function scrapeData() {
  const url = `https://thuttu.com/`;
  try {
    const response = await axios.get(url);
    const html = response.data;
    const extractedData = [];

    const $ = cheerio.load(html);
    const selectedElem = ".deals-grid.deals.msyitem";

    $(selectedElem).each((index, element) => {
      const productDetails = {};

      productDetails.productImgLink = $(element)
        .find(".pimg a img")
        .attr("src");

      productDetails.productLink = $(element).find(".pimg a").attr("data-link");
      productDetails.title = $(element)
        .find(".post-title.pdetail a")
        .text()
        .trim();
      const dealPrice = $(element).find(".dealprice.dprice").text().trim();
      const originalPrice = $(element).find(".mrpprice.oprice").text().trim();
      productDetails.dealPrice = dealPrice;
      productDetails.originalPrice = originalPrice;

      extractedData.push(productDetails);
    });

    return extractedData;
  } catch (error) {
    return [];
  }
}

// Initial load of deals
app.get("/api/products", async (req, res) => {
  try {
    const crypto = await scrapeData();
    return res.status(200).json({
      result: crypto,
    });
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});
