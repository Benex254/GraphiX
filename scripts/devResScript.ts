const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs")

const url = "https://github.com/bradtraversy/design-resources-for-developers";

request(url, (error: any, response: any, html: any) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    const article = $("article");

    //creating the resourceNames array
    const resourceNames: String[] = [];
    article.find(".markdown-heading h2").each((i: any, el: any) => {
      if (i === 0) return;
      const resourceName = $(el).text();
      resourceNames.push(resourceName);
    });

    //creating the resources array
    const resourceDescriptions: String[] = [];
    article.find("blockquote p").each((i: any, el: any) => {
      //   if (i === 0) return;
      const resourceDescription = $(el).text();
      resourceDescriptions.push(resourceDescription);
    });

    //creating the resourcesTables array
    const resourcesTables: any[] = [];
    article.find("table").each((i: Number, el: any) => {
      //   if (i === 0) return;

      const resourcesTable: any = $(el);
      resourcesTables.push(resourcesTable);
    });

    //creating the websites array
    const devResources: Object[] = [];
    resourcesTables.forEach((table: any, i: number) => {
      // getting the websitesName
      const websites: String[] = [];
      table.find("tbody tr td a").each((i: number, el: any) => {
        const website: String = $(el).text();

        websites.push(website);
      });

      // getting the websitesLinks
      const websiteLinks: String[] = [];
      table.find("tbody tr td a").each((i: Number, el: any) => {
        const websiteLink: String = $(el).attr("href");

        websiteLinks.push(websiteLink);
      });

      // getting the descriptions
      const descriptions: String[] = [];
      table.find("tbody tr td").each((i: number, el: any) => {
        if (i % 2 === 0) return;
        const description: String = $(el).text();

        descriptions.push(description);
      });

      const resources: Object[] = [];
      websites.forEach((website: String, i: number) => {
        const resource: {
          website: String;
          link: String;
          description: String;
        } = {
          website,
          link: websiteLinks[i],
          description: descriptions[i],
        };
        resources.push(resource);
      });

      //setting the resources for single resource type
      const resourcesObject: {
        resourceName: String;
        resourceDescription: String;
        resources: Object[];
      } = {
        resourceName: resourceNames[i],
        resourceDescription: resourceDescriptions[i],
        resources,
      };
      devResources.push(resourcesObject);
    });
    const devResourcesStream = fs.createWriteStream("devResources.json")
    devResourcesStream.write(JSON.stringify(devResources))
    console.log("\nDone creating resources😆\n","Happy coding 😃");
  }

});
