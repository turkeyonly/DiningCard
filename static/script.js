// 選擇所有的可拖曳列表項目
const initializeDragEvents = () => {
    const listItems = document.querySelectorAll('.sortable-list li');

    listItems.forEach(item => {
        item.addEventListener('dragstart', () => {
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });

    const lists = document.querySelectorAll('.sortable-list');

    lists.forEach(list => {
        list.addEventListener('dragover', event => {
            event.preventDefault();
            const draggingItem = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(list, event.clientY);
            if (afterElement == null) {
                list.appendChild(draggingItem);
            } else {
                list.insertBefore(draggingItem, afterElement);
            }
        });

        // 當列表為空時，也允許接收拖曳項目
        list.addEventListener('drop', event => {
            event.preventDefault();
            const draggingItem = document.querySelector('.dragging');
            list.appendChild(draggingItem);
        });
    });
};

// 計算應該插入的位置
function getDragAfterElement(list, y) {
    const listItems = [...list.querySelectorAll('li:not(.dragging)')];

    return listItems.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 新增欄位按鈕點擊事件
document.getElementById('add-column-btn').addEventListener('click', () => {
    const container = document.getElementById('columns-container');

    // 創建新欄位元素
    const newColumn = document.createElement('div');
    newColumn.classList.add('column');
    newColumn.innerHTML = `
        <h3>新欄位</h3>
        <button class="add-item-btn">新增項目</button>
        <ul class="sortable-list">
            <li draggable="true">
                菜單 1
                <div class="input-fields">
                    <label>食材: <input type="text" name="ingredient"></label>
                    <label>用具: <input type="text" name="tool"></label>
                    <label>時間: <input type="text" name="time"></label>
                </div>
            </li>
            <li draggable="true">
                菜單 2
                <div class="input-fields">
                    <label>食材: <input type="text" name="ingredient"></label>
                    <label>用具: <input type="text" name="tool"></label>
                    <label>時間: <input type="text" name="time"></label>
                </div>
            </li>
        </ul>
    `;
    
    // 將新欄位添加到容器中
    container.appendChild(newColumn);
    
    // 重新初始化新欄位的拖曳功能和新增項目按鈕事件
    initializeDragEvents();
    initializeAddItemEvents();
});

// 新增項目按鈕點擊事件
const initializeAddItemEvents = () => {
    const addItemButtons = document.querySelectorAll('.add-item-btn');

    addItemButtons.forEach(button => {
        button.addEventListener('click', () => {
            const list = button.nextElementSibling; // 找到對應的列表 (ul)

            // 創建新項目
            const newItem = document.createElement('li');
            newItem.draggable = true;
            newItem.innerHTML = `
                新菜單 ${list.children.length + 1}
                <div class="input-fields">
                    <label>食材: <input type="text" name="ingredient"></label>
                    <label>用具: <input type="text" name="tool"></label>
                    <label>時間: <input type="text" name="time"></label>
                </div>
            `;

            // 添加到列表中
            list.appendChild(newItem);

            // 重新初始化拖曳功能
            initializeDragEvents();
        });
    });
};

// 確保初始加載時，所有欄位綁定拖曳事件和新增項目按鈕事件
window.onload = () => {
    initializeDragEvents();
    initializeAddItemEvents();
};