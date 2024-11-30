# 利用cloudflare worker或pages 反代网页

内容转载自 https://linux.do/t/topic/273289 

CF部署： [worker版本](https://github.com/ve-cf-bushu/fandai-CFworkerpages-F_Droid/blob/worker/worker.js)  [pages无密码版本](https://github.com/ve-cf-bushu/fandai-CFworkerpages-F_Droid/tree/pages-no_password) [pages有密码版本](https://github.com/ve-cf-bushu/fandai-CFworkerpages-F_Droid/tree/pages-have_password)



## 原作者说明：

> 我写的这个CF安全反带有几个特征，就是它会自动删除浏览器的一些关键信息，包括浏览器的UA，请求的源IP地址，浏览器类型以及访问语言。并且根据你不同的浏览器伪造相同类型设备的不同UA，以及随机生成IP来保护你的隐私，当然它唯一的缺点就是反代在CF上的网站时，会泄露你的workers绑定的域名，经过各种各样的尝试，我发现这个问题应该是无解的，不过反代不使用Cloudflare CDN网站那是相当安全的，比如反代谷歌，抱脸等，而且设置反代的域名是通过环境变量进行设置的比较灵活，切换时非常方便。下面我贴出源码跟大家一起交流使用
