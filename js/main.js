//访问豆瓣API 拿到电影的数据
/**
 * 跨域： JSONP  CORS
 * /
 

 /**
  * 封装jsonp函数
  * 参数：
  *     1. url地址
  *     2. 携带的参数
  *     3. 回调函数
  * 
  * 原理：script的src属性没有跨域限制
  */

  function jsonp(url, arg, fn)
  { 
    /**
     *   arg = {
     *      name : qwe,
     *      sex : nv
     * }
     */
    //动态的创建script标签，设置src属性请求响应的地址
    var script = document.createElement('script');

    //拼接参数
    //url?name=qwe&sex=nv
    var str = '';   //保存传递的参数，最后再拼接到url中

    for (var i in arg) {
        str += '&' + i + '=' + arg[i] + '&';
    }
    //str = &name=qwe&sex=nv&

    //funcName别重复，为啥？ 因为重复了就被覆盖了
    var funcName = 'func_' + Math.random().toString().substr(3);
   // console.log(funcName);
    //将回调函数 放到window对象中保存起来，可以全局调用
    window[funcName] = fn

    //将参数拼接到url中不就ok了吗
    if (url.indexOf('?') == -1) {
        url += '?' + str;
    } else {
        url += str;
    }
    //将回调函数拼接到url中
    url += 'callback=' + funcName

    //将url地址设置到 src属性中
    script.src = url;
    //将script标签追加到 body中
    document.body.appendChild(script);

  }
  $(function () {
      jsonp('https://api.douban.com/v2/movie/in_theaters', {
        apikey:'0b2bdeda43b5688921839c8ecb20399b'
        }, function (data) {
            //console.log(data);
            //渲染豆瓣接口返回的数据
            var htmlStr = '';  //保存html内容
            var res = data.subjects;
            //遍历res数组
            res.forEach(function (item, index) {
                //默认页面刚加载时，显示的是第一组的数据，其他的先不显示
                if (index == 0) {
                    htmlStr += `
                    <div class="item active">
                    <div class="row text-center">
                    `;
                } else {
                    htmlStr += `
                    <div class="item ">
                    <div class="row text-center">
                    `;
                }
                //item.casts 保存的是演员的信息 我们需要遍历它
                for (var per of item.casts) {
                    //console.log(per);
                    if (per.avatars) {
                        htmlStr += `
                            <!-- ITEM-->
                            <div class="span3">
                                <div class="thumbnail product-item">
                                    <a href="${per.alt}">
                                    <img src="${per.avatars.medium}"></a>
                                </div>
                                <h5>${per.name}</h5>
                                <p><a href="${per.alt}" rol="button" class="btn btn-primary btn-sm">查看详情 &gt;&gt;</a></p>
                            </div>
                            <!-- ITEM-->
                        `;
                    }
                }
                htmlStr += `
                </div>
                </div>
                `;
                $('#myCarousel .carousel-inner').html(htmlStr);
            });
    });



    //获取top20 的电影
    jsonp('https://api.douban.com/v2/movie/top250', {
        apikey:'0b2bdeda43b5688921839c8ecb20399b'
    }, function (data) {
        var htmlStr = '';
        var res = data.subjects;
        
        for (var i = 0; i < res.length; i++) {
            htmlStr += `
            <li><a href="https://movie.douban.com/subject/${res[i].id}">${res[i].title}</a></li>
            `;
        }
        $('#top20').html(htmlStr);
    });

    //执行搜索
    $("#searchBtn").click(function () {
        //获取搜索框输入的内容
        var searchCon = $("#searchInput").val().trim();
        var htmlStr = ''
        if (searchCon == '') {
            alert('请输入查询内容');
        } else {
            jsonp('https://api.douban.com/v2/movie/search', {
                apikey: '0b2bdeda43b5688921839c8ecb20399b',
                q: searchCon
            },function (data) {
                console.log(data);
                htmlStr += '搜索接口不好使了，了解一下代码吧';
                $("#searRes").html(htmlStr);
            });
        }
    });
  });
  
 //发送接口时携带的参数 都是根据当前接口的文档来的 文档里怎么要求我们就怎么写
  

  
