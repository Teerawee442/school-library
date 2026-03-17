window.onload = () => {
    displayItems();
};

function addBorrow() {
    const book = document.getElementById('bookName').value;
    const user = document.getElementById('userName').value;
    const uClass = document.getElementById('userClass').value;
    const uNo = document.getElementById('userNo').value;

    if (!book || !user || !uClass || !uNo) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่องครับ");
        return;
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 7);

    const newBorrow = {
        id: Date.now(),
        book: book,
        user: user,
        class: uClass,
        no: uNo,
        dueDate: dueDate.toISOString()
    };

    let list = JSON.parse(localStorage.getItem('library-list') || '[]');
    list.push(newBorrow);
    localStorage.setItem('library-list', JSON.stringify(list));

    // ล้างข้อมูลในช่องกรอก
    document.getElementById('bookName').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('userClass').value = '';
    document.getElementById('userNo').value = '';
    
    displayItems();
}

function displayItems() {
    const list = JSON.parse(localStorage.getItem('library-list') || '[]');
    const container = document.getElementById('borrowList');
    container.innerHTML = '';

    list.forEach(item => {
        const today = new Date();
        const dueDate = new Date(item.dueDate);
        const diffTime = today - dueDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let fineInfo = "";
        let overdueClass = "";

        if (diffTime > 0) {
            const fine = diffDays * 1;
            fineInfo = `<div class="fine-badge">🚨 เกินกำหนด ${diffDays} วัน | ค่าปรับ ${fine} บาท</div>`;
            overdueClass = "overdue-text";
        }

        container.innerHTML += `
            <div class="card">
                <div class="user-meta">ชั้น: ${item.class} | เลขที่: ${item.no}</div>
                <h4>📖 ${item.book}</h4>
                <p>ผู้ยืม: <strong>${item.user}</strong></p>
                <p class="${overdueClass}">กำหนดคืน: ${dueDate.toLocaleDateString('th-TH')}</p>
                ${fineInfo}
                <button class="btn-return" onclick="returnItem(${item.id})">คืนหนังสือ</button>
            </div>
        `;
    });
}

function returnItem(id) {
    if (confirm("ยืนยันการคืนหนังสือ?")) {
        let list = JSON.parse(localStorage.getItem('library-list') || '[]');
        list = list.filter(item => item.id !== id);
        localStorage.setItem('library-list', JSON.stringify(list));
        displayItems();
    }
}