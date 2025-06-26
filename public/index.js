function Check() {
    const task = document.querySelector('#newtext').value.trim();
    if (!task) {
        alert('タスク内容を入力してください！');
        return false;
    }
    return true;
}