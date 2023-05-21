// 作用：需要将所有的DOM元素对象以及相关的资源全部加载完毕之后，再来实现的时间函数
window.onload = function(){
    // 为了避免在全局作用域上变量污染的问题，把所有功能划分成一个函数
    
    // 声明一个记录onmouseenter的缩略图下标
    var bigimgIndex = 0;

    // 函数调用(函数有域解析的功能)
    navPathDataBind();
    // 路径导航的数据渲染
    function navPathDataBind(){
            /**
         * 思路：
         * 1. 先货物路径导航的页面元素（navPath）
         * 2. 再来获取所需要的数据（data.js->goodData.path）
         * 3. 由于数据是需要动态产生的，相应的DO母元素也应该是动态产生的。这意味着需要根据数据的数量来创建DOM元素
         * 4. 在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
         */

        //1. 获取页面导航的元素对象
        var navPath = document.querySelector('#nav .navMain #navPath');
        //2. 获取数据
        var path = goodData.path;
        //遍历数据
        for(let i = 0; i < path.length; i++){
            if(i == path.length - 1){
                // 创建a且没有href属性
                var aNode = document.createElement('a');
                aNode.innerText = path[i].title;
                aNode.className = 'hov';
                navPath.appendChild(aNode);
            }else{
                // 4. 创建对应的标签
                var aNode = document.createElement('a');
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                //5. 创建i标签
                var iNode = document.createElement('i');
                iNode.className = 'iconfont';
                iNode.innerText = '\ue88e';
                // 6. 让navPath元素来追加a和i
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }

        }
    }

    // 放大镜的移入、移出效果
    bigClassBind();
    function bigClassBind(){
        /**
         * 思路：
         * 1. 获取小图框元素对象，并且设置移入事件（onmouseover有冒泡、onmouseenter无冒泡），选择onmouseenter
         * 2. 动态创建蒙版元素以及大图框和大图片的元素
         * 3. 移出时需要移除蒙版元素和大图框
         */

        // 1. 获取小图框元素
        var smallPic = document.querySelector('#wrap #content .contentMain #center #left #leftTop #smallPic');
        var leftTop = document.querySelector('#wrap #content .contentMain #center #left #leftTop');

        // 获取imagessrc
        var imagessrc = goodData.imagessrc;

        // 2. 设置移入的事件
        smallPic.onmouseenter = function(){
            // 3. 动态创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.className = 'mask';

            // 4. 创建大图框元素
            var bigPic = document.createElement('div');
            bigPic.id = 'bigPic';

            // 5. 创建大图片元素
            var bigImg = document.createElement('img');
            bigImg.src = imagessrc[bigimgIndex].b;

            // 6. 大图框追加大图片
            bigPic.appendChild(bigImg);

            // 7. 小图框追加蒙版元素
            smallPic.appendChild(maskDiv);

            // 8. leftTop元素追加大图框
            leftTop.appendChild(bigPic);

            // 设置移动事件
            smallPic.onmousemove = function(event){
                // event.clientX:鼠标点距离浏览器左侧x轴的值
                // getBoundingClientRect().left:小图框元素距离浏览器左侧可视Left值
                // offsetWidth：为元素的占位宽度
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

                // 判断
                if(left < 0){
                    left = 0;
                }else if(left > smallPic.clientWidth - maskDiv.offsetWidth){
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }

                if(top < 0){
                    top = 0;
                }else if(top > smallPic.clientHeight - maskDiv.offsetHeight){
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }

                // 设置left和top属性
                maskDiv.style.left = left + 'px';
                maskDiv.style.top = top + 'px';

                // 移动的比例关系 = 蒙版元素移动的距离 / 大图片元素移动的距离
                // 蒙版元素移动的距离 = 小图框宽度 - 蒙版元素的宽度
                // 大图片元素移动的距离 = 大图片宽度 - 大图框元素的宽度
                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth);
                bigImg.style.left = - left / scale + 'px';
                bigImg.style.top = - top / scale + 'px';

            }

            //设置移出事件（写在移入里因为要借用其中的变量）
            smallPic.onmouseleave = function(){
                // 让小图框移除蒙版元素
                smallPic.removeChild(maskDiv);
                // 让leftTop元素移除大图框
                leftTop.removeChild(bigPic);
                // removeChild前面的元素和参数的元素必须为直接的子父关系，否则报错。
            }
        }
    }
    
    // 动态渲染放大镜缩略图的数据
    thumbnailData();
    function thumbnailData(){
        /**
         * 思路：
         * 1. 先获取piclist元素下的ul
         * 2. 获取data.js文件下的goodData->imagessrc
         * 3. 遍历数组，根据数组的长度来创建li元素
         * 4. 让ul遍历追加li
         */

        // 1. 获取piclist元素下的ul
        var ul = document.querySelector('#wrap #content .contentMain #center #left #leftBottom #piclist ul');
        // 2. 获取imagessrc数据
        var imagessrc = goodData.imagessrc;
        // 3. 遍历数组
        for(let i = 0; i < imagessrc.length; i++){
            // 4. 创建li元素
            var newli = document.createElement('li');
            // 5.创建img元素
            var newImg = document.createElement('img');
            newImg.src = imagessrc[i].s;
            // 6. li追加img
            newli.appendChild(newImg);
            // 7. 让ul遍历追加li
            ul.appendChild(newli);
        }
    }

    // 鼠标悬停缩略图的效果
    thumbnailMouseover();
    function thumbnailMouseover(){
        /**
         * 思路：
         * 1. 获取所有的li元素，并且循环发生onmouseenter事件
         * 2. 点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有的src值
         */

        // 1. 获取所有的li元素
        var liNodes = document.querySelectorAll('#wrap #content .contentMain #center #left #leftBottom #piclist ul li');
        var smallPic_img = document.querySelector('#wrap #content .contentMain #center #left #leftTop #smallPic img');
        var imagessrc = goodData.imagessrc;
        // 2. 循环onmouseenter事件
        for(let i = 0; i < liNodes.length; i++){
            // 在事件之前， 给每一个元素都添加上自定义的下标
            // liNodes[i].index = i;/**还可以通过setAttribute('index',i) */
            liNodes[i].onmouseenter = function(){
                bigimgIndex = i;
                
                // 变化小图路径
                smallPic_img.src = imagessrc[i].b;
            }
        }
    }

    // 点击缩略图左右箭头的效果
    thumbnailLeftRightClick();
    function thumbnailLeftRightClick(){
        /**
         * 思路：
         * 1. 获取左右两端的箭头按钮
         * 2. 获取可视的div、ul和所有li元素
         * 3. 计算（发生起点、步长、总体运动的距离值
         * 4. 发生点击事件
         */
        // 获取箭头元素
        var prev = document.querySelector('#wrap #content .contentMain #center #left #leftBottom a .prev');
        var next = document.querySelector('#wrap #content .contentMain #center #left #leftBottom a .next');

        // 获取可视的div、ul和所有li元素
        var piclist = document.querySelector('#wrap #content .contentMain #center #left #leftBottom #piclist');
        var ul = document.querySelector('#wrap #content .contentMain #center #left #leftBottom #piclist ul');
        var liNodes = document.querySelectorAll('#wrap #content .contentMain #center #left #leftBottom #piclist ul li');
        
        // 计算
        // 发生起点
        var start = 0;
        // 总体运动的距离值
        var step = liNodes[0].offsetWidth * 5;
        // 总体运动的距离值 = ul的宽度 - div框的宽度 = （图片的总数 - div中显示的数量） * li的宽度
        var endPosition = (liNodes.length - 5) * liNodes[0].offsetWidth;

        // 发生事件
        prev.onclick = function(){
            start-=step;
            if(start < 0){
                start = 0;
            }
            ul.style.left= start + 'px';
        }

        next.onclick = function(){
            start+=step;
            if(start > endPosition){
                start = endPosition;
            }
            ul.style.left= -start + 'px';
        }

    }
    
    // 商品详情数据的动态渲染
    rightTopData();
    function rightTopData(){
        /**
         * 思路：
         * 1. 查找rightTop元素
         * 2. 查找data.js->goodData->goodsDetail
         * 3. 建立一个字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上重新渲染rightTop元素
         */
        // 查找元素
        var rightTop = document.querySelector('#wrap #content .contentMain #center .right .rightTop');
        // 查找数据
        var goodsDetail = goodData.goodsDetail;
        // 创建字符串（双引号、单引号、模板字符串）变量
        // 模板字符串替换数据：${变量}
        var s = `<h2>${goodsDetail.title}</h2>
                <p>${goodsDetail.recommend}<span>点击<a href="javascript:;">查看></a></span></p>
                <div class="priceWrap">
                    <span>京&nbsp;&nbsp;东&nbsp;&nbsp;价</span>
                    <div class="price">
                        <span>￥</span>
                        <p>${goodsDetail.price}</p>
                        <a href="javascript:;"><i>降价通知</i></a>
                    </div>
                    <p>
                        <span>累计评价</span>
                        <a href="javasript:;">${goodsDetail.evaluateNum}</a>
                    </p>
                </div>
                <div class="support">
                    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                    <p><span>${goodsDetail.support[0]}</span>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;">${goodsDetail.support[1]}</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;">${goodsDetail.support[2]}</a></p>
                </div>
                <div class="address">
                    <span>配&nbsp;&nbsp;送&nbsp;&nbsp;至</span>
                    <p>${goodsDetail.address}</p>
                </div>
                <div class="weight">
                    <span>重&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量</span>
                    <p>${goodsDetail.weight}</p>
                </div>`;
                // 重新渲染rightTop元素
                rightTop.innerHTML = s;
    }

    // 商品颜色图选择的动态渲染
    rightMiddleFirstData();
    function rightMiddleFirstData() {
        /**
         * 思路：
         * 1. 找rightMiddle的元素对象
         * 2. 查找data.js->goodData.goodsDetail.crumbData.data数据
         * 3. 由于数据是一个数组，需要遍历。需要有一个动态的dl元素对象（dt、dd）
         */

        // 查找元素对象
        var chooseWrap = document.querySelector('#wrap #content .contentMain #center .right .rightMiddle .chooseWrap');
        // 查找数据
        var crumbData = goodData.goodsDetail.crumbData;

        // 创建dl，dt元素
        var dlNode = document.createElement('dl');
        var dtNode = document.createElement('dt');

        dtNode.innerText = crumbData[0].title;

        // dl追加dt
        dlNode.appendChild(dtNode);
        dlNode.className = 'chooseColor';

        // 循环数据
        for(let a = 0; a < crumbData[0].data.length; a++){
            // 创建dd，span，img元素
            var ddNode = document.createElement('dd');
            var spanNode = document.createElement('span');
            var imgNode = document.createElement('img');
            spanNode.innerText = crumbData[0].data[a].type;
            imgNode.src = crumbData[0].data[a].img;

            // 添加价格属性
            ddNode.setAttribute('price', crumbData[0].data[a].changePrice);

            // dd追加span和img
            ddNode.appendChild(imgNode);
            ddNode.appendChild(spanNode);
            // dl追加dd元素
            dlNode.appendChild(ddNode);
            // chooseWrap追加dl
            chooseWrap.appendChild(dlNode);
        }
    }

    // 商品参数数据的动态渲染
    rightMidlleData();
    function rightMidlleData(){
        /**
         * 思路：
         * 1. 找rightMiddle的元素对象
         * 2. 查找data.js->goodData.goodsDetail.crumbData数据
         * 3. 由于数据是一个数组，需要遍历。有一个元素则需要有一个动态的dl元素对象（dt、dd）
         */

        // 查找元素对象
        var chooseWrap = document.querySelector('#wrap #content .contentMain #center .right .rightMiddle .chooseWrap');
        // 查找数据
        var crumbData = goodData.goodsDetail.crumbData;

        

        // 循环数据
        for(let i = 1; i < crumbData.length; i++){
            // 创建dl，dt元素
            var dlNode = document.createElement('dl');
            var dtNode = document.createElement('dt');
            
            dtNode.innerText = crumbData[i].title;
            // dl追加dt
            dlNode.appendChild(dtNode);

            // 遍历crumbData->data
            for(let j = 0; j < crumbData[i].data.length; j++){
                // 创建dd元素
                var ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type;
                ddNode.setAttribute('price', crumbData[i].data[j].changePrice);
                // dl追加dd元素
                dlNode.appendChild(ddNode);
            }

            // chooseWrap追加dl
            chooseWrap.appendChild(dlNode);

        }
    }

    // 点击商品参数之后的颜色排他效果
    clickddBind();
    function clickddBind(){
        /**
         * 思路：
         * 1. 获取所有的dl元素，取其中第一个dl元素下的所有dd先做测试
         *    测试之后在对应dl第一行下标的前面再嵌套一个for循环，目的在变换下标
         * 2. 循环所有的dd元素并且添加点击事件
         * 3. 确定实际发生时间的目标源对象设置其文字颜色为红色，然后给其他所有元素都重置为基础颜色
         */

        // 取其中第一个dl元素下的所有dd元素
        var dlNodes = document.querySelectorAll('#wrap #content .contentMain #center .right .rightMiddle .chooseWrap dl');
        
        var arr = new Array(dlNodes.length);

        for(let i = 0; i < dlNodes.length; i++){

            (function(i){
                var ddNodes = dlNodes[i].querySelectorAll('dd');
                // 遍历当前所有dd元素
                for(let j = 0; j < ddNodes.length; j++){


                    ddNodes[j].onclick = function(){
                        for(let k = 0; k < ddNodes.length; k++){
                            ddNodes[k].style.border = "1px solid #ccc";
                        }
                        ddNodes[j].style.border = "1px solid red";

                        // 点击某个dd元素，动态产生一个数组
                        arr[i] = this;

                        changePriceBind(arr); //传入实参
                        
                        //配件区域左侧图片与“选择颜色”一致
                        var leftImage = document.querySelector('#wrap #content .contentMain .accessory .fittings .accessoryMain .acLeft img');
                        var imgs = document.querySelectorAll('#wrap #content .contentMain #center .right .rightMiddle .chooseWrap .chooseColor > dd > img');
                        if(imgs[j].src){
                            leftImage.src = imgs[j].src;
                        }
                    }
                    
                }
            })(i)
        }
        
    }

    // 价格变动的函数声明
    /**
     * 在需要点击dd时调用
     */
    function changePriceBind(arr){ //传入形参
        /**
         * 思路：
         * 1. 获取价格的标签元素
         * 2. 给每一个dd标签默认都设置一个自定义的属性，用来记录变化的价格
         * 3. 遍历arr数组，将dd元素新变化的价格和已有的价格相加
         * 4. 将计算之后的结果重新渲染到p标签中
         */

        // 1. 获取价格的标签元素
        var oldPrice = document.querySelector('#wrap #content .contentMain #center .right .rightTop .priceWrap .price > p');

        // 取出默认价格
        var price = goodData.goodsDetail.price;

        // 2.遍历arr数组
        for(let i = 0; i < arr.length; i++){
            // 这里的arr需要函数调用，将arr传过来
            if(arr[i]){
                // 数据类型强制转换
                var changeprice = Number(arr[i].getAttribute('price'));
                // 最终价格
                price += changeprice;
            }
        }
        oldPrice.innerText = price;

        // 将变化后的价格写入配件区域右侧标签
        // 遍历选择搭配中所有的复选框元素，看是否有选中的
        var ipts = document.querySelectorAll('#wrap #content .contentMain .accessory .fittings .accessoryMain .acMiddle li div input');
        var newprice = document.querySelector('#wrap #content .contentMain .accessory .fittings .accessoryMain .acRight .selectedPrice strong');

        for(let j = 0; j < ipts.length; j++){
            if(ipts[j].checked){
                price += Number(ipts[j].value);
            }
            // 右侧套餐价重新渲染
            newprice.innerText = '￥' + price;
        }

    }

    
    // 选择搭配中间区域复选框选中套餐价以及选中数量变动效果
    chooseprice();
    function chooseprice(){
        /**
         * 思路：
         * 1. 获取中间区域所有复选框元素
         * 2. 遍历这些元素，取出他们的价格，和基础价格累加
         * 3. 累加后写回套餐价标签中
         */
        var ipts = document.querySelectorAll('#wrap #content .contentMain .accessory .fittings .accessoryMain .acMiddle li div input');
        var leftprice = document.querySelector('#wrap #content .contentMain #center .right .rightTop .priceWrap .price > p');
        var newprice = document.querySelector('#wrap #content .contentMain .accessory .fittings .accessoryMain .acRight .selectedPrice strong');
        var selectedNumber = document.querySelector('#wrap #content .contentMain .accessory .fittings .accessoryMain .acRight .selected span');
        
        
        for(let i = 0; i < ipts.length; i++){
            ipts[i].onclick = function(){
                var oldprice = Number(leftprice.innerText.slice(0));
                var newNum = 0;
                console.log(oldprice)
                for(let j = 0; j < ipts.length; j++){
                    if(ipts[j].checked){
                        oldprice += Number(ipts[j].value);
                        newNum += 1;
                    }
                }
                newprice.innerText = '￥' + oldprice;
                selectedNumber.innerText = newNum;

            }
        }
    }

    // 封装一个公共的选项卡函数
    /**
     * 参数：
     * 1. 被点击的元素
     * 2. 被切换显示的元素
     */
    function Tab(tabBtns,tabConts){
        for(let i = 0; i < tabBtns.length; i++){
            tabBtns[i].index = i;
            tabBtns[i].onclick = function(){
                for(let j = 0; j < tabBtns.length; j++){
                    tabBtns[j].className = '';
                    tabConts[j].className = '';
                }
                this.className = 'active';
                tabConts[this.index].className = 'active';
            }
        }
    }

    // 点击配件区域导航
    accTab();
    function accTab(){
        var liNodes = document.querySelectorAll('#wrap .accessory .fittings .accessoryNav ul li');
        var divs = document.querySelectorAll('#wrap .accessory .fittings .accessoryMain .acc');
        Tab(liNodes,divs);

    }

    // 点击左侧选项卡
    leftTab();
    function leftTab(){
        var pNodes = document.querySelectorAll('#wrap .goodsDetailWrap .leftAside .asideTop p');
        var divs = document.querySelectorAll('#wrap .goodsDetailWrap .leftAside .aslideContent>div');
        Tab(pNodes,divs);
    }

    // 点击右侧
    rightTab();
    function rightTab(){
        var liNodes = document.querySelectorAll('#wrap .goodsDetailWrap .rightDetail .chooseDetail .tabBtns li');
        var divs = document.querySelectorAll('#wrap .goodsDetailWrap .rightDetail .chooseDetail .tabContents>div');
        Tab(liNodes,divs);
    }

    
    


    
}