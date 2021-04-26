const Crawler = require('crawler');
const cheerio = require('cheerio')
const getHrefs = require('get-hrefs');
const rimraf = require('rimraf')
const fs = require('fs')

class href_spider{
    constructor(){
        this.c = new Crawler({
            maxConnections: 500,
            // This will be called for each crawled page
           /* callback: (error, res, done) => {
                if (error) {
                    console.log(error);
                } else {
                    const $ = res.$;
                    // $ is Cheerio by default
                    //a lean implementation of core jQuery designed specifically for the server
                    console.log($('title').text());
                }
                done();
            }*/
        });
        this.dir = "download"
    }

    parseCondition(aCondition){
        if (!aCondition.length)
            return function(){
                return true
            }
        else{
            let cd = ["&&"].concat(aCondition)
            return e => {
                let ret = true
                for (let i = 0; i < cd.length; i += 2){
                    let func = null
                    if (cd[i + 1]["has"])
                        func = e => {
                            return e.indexOf(cd[i + 1]["has"]) >= 0
                        }
                    else if (cd[i + 1]["not_has"])
                        func = e => {
                            return e.indexOf(cd[i + 1]["has"]) < 0
                        }
                    else
                        continue
                    if (cd[i] == "&&")
                        ret &= func(e)
                    else if (cd[i] == "||")
                        ret |= func(e)
                }
                return ret
            }
        }
    }

    search(aCondition){
        if (fs.existsSync(this.dir))
            rimraf.sync(this.dir)
        fs.mkdirSync(this.dir)

        this.validSearch = this.parseCondition(aCondition["search"])
        this.validResult = this.parseCondition(aCondition["result"])

        let download = (error, res, done) => {
            const uri = res.options.uri
            let nm = ++this.complete;
            if (this.validResult(uri)){
                //let $ = cheerio.load(res.body)
                //let cnt = $('.articalContent')

                this.files += nm + "." + uri + "\n"
                fs.createWriteStream(this.dir + "/" + nm + ".html").write(res.body)
            }
            if (this.complete == this.counter && this.counter)
                fs.createWriteStream(this.dir + "/names.txt").write(this.files)
        
            let lnks = getHrefs(res.body)
            lnks.forEach(e => {
                if ((this.max_search_count == "running" || this.counter < this.max_search_count) && 
                    !this.has[e] && this.validSearch(e)){
                    this.has[e] = true
                    this.counter++
                    this.c.queue([{uri: e, callback: download}])
                }
            })
            done()
        }

        this.has = {[aCondition["root"]]: true}
        this.counter = 0
        this.complete = - 1
        this.files_names = ""
        this.max_search_count = aCondition["max_search_count"] || 1000
        this.c.queue([{
            uri: aCondition["root"],
            callback: download
        }]);
    }
}

let sp = new href_spider();

let condition = {
    max_search_count: 1000,
    root: 'http://blog.sina.com.cn/robbeykaaso',
    search: [ //step
        {has: "blog.sina.com.cn/s/"},  //action
        "&&",  //logic
        {not_has: "profile_"}  //action
    ],
    result: [ //step
        {has: "blog_4b30"}  //action
    ]
}

sp.search(condition)