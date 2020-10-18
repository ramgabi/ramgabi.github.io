// 인덱스값 얻기

function getIndexForMemo(ele) {
    let index = 0;

    while((ele = ele.previousSibling) != null) {
        if(ele.nodeType === 1) index++;
    }
    return index;
}

// memo 불러오기 (홈)

function loadMemo() {
    let memoBox = '';
    
    if(LS_memoList && LS_memoList != '[]') {
        const memoList = JSON.parse(localStorage.memoList);
        memoList.forEach(function (memoItem) {
            if(memoItem.type == 'clear') {
                memoBox += `<li class="memo-item memo-clear">${memoItem.text}`;
            }else{
                memoBox += `<li class="memo-item">${memoItem.text}`;
            }
            memoBox += `<div class="memo-btn">
                                <a href="#" class="memo-chk" onclick="chkMemo(this)">완료</a>
                                <a href="#" class="memo-del" onclick="delMemo(this)">삭제</a>
                            </div>
                        </li>`;
        });                  
        $memoList.innerHTML = memoBox;

        return;
    }  
    $todayMsg.textContent = '오늘의 할일이 없어요';
}


// memo 체크 및 삭제

function chkMemo(rowMemo) {
    const memo = rowMemo.parentNode.parentNode;
    
    let isIndex = getIndexForMemo(memo);

    let rowMemoList = JSON.parse(localStorage.memoList);
    let editMemo = rowMemoList[isIndex];
    
    if(memo.classList.contains('memo-clear')) {
        memo.classList.remove('memo-clear');
        editMemo.type = 'normal';
    }else{
        memo.classList.add('memo-clear');
        editMemo.type = 'clear';
    }
    
    rowMemoList.splice(isIndex, 1, editMemo);
    console.log(rowMemoList)
    localStorage.setItem('memoList',JSON.stringify(rowMemoList));

}

function delMemo(rowMemo) {
    const memo = rowMemo.parentNode.parentNode;

    memo.classList.add('memo-remove');
    setTimeout(function(){        
        let rowMemoList = JSON.parse(localStorage.memoList);

        rowMemoList.splice(getIndexForMemo(memo), 1);
        localStorage.setItem('memoList',JSON.stringify(rowMemoList));

        memo.parentNode.removeChild(memo);
    },500);

    if(memo.parentNode.childElementCount == 1){
        $todayMsg.textContent = '오늘의 할일이 없어요';
    }
    
}


// memo 추가

function addMemo(e) {
    e.preventDefault();

    if(e.target.childNodes[1].value == '') return;
    
    if(!LS_memoList){
        localStorage.setItem('memoList',JSON.stringify([]));
    }

    let rowMemoList = JSON.parse(localStorage.memoList);
    rowMemoList.push({
        type : 'normal',
        text : e.target.childNodes[1].value
    });
    localStorage.setItem('memoList',JSON.stringify(rowMemoList));

    
    let newMemoLi = document.createElement('li');
    newMemoLi.classList.add('memo-item');
    newMemoLi.innerHTML = `${e.target.childNodes[1].value}
                            <div class="memo-btn">
                                <a href="#" class="memo-chk" onclick="chkMemo(this)">완료</a>
                                <a href="#" class="memo-del" onclick="delMemo(this)">삭제</a>
                            </div>`;
    
    $memoList.appendChild(newMemoLi);

    e.target.childNodes[1].value = '';

    if($todayMsg.textContent == '오늘의 할일이 없어요'){
        $todayMsg.textContent = '오늘의 할일은';
    }
}

document.querySelector('.home-frm').addEventListener('submit',addMemo);

loadMemo();