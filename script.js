// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, push, set, remove, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyBtW27PLuEEQeNHIk3yfwf7uBWQG3aVAu8",
authDomain: "vibe-coding-backend-500c3.firebaseapp.com",
projectId: "vibe-coding-backend-500c3",
storageBucket: "vibe-coding-backend-500c3.firebasestorage.app",
messagingSenderId: "617062125774",
appId: "1:617062125774:web:3153f6b757cefe5023c09f",
databaseURL: "https://vibe-coding-backend-500c3-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

class MemoApp {
    constructor() {
        this.memos = [];
        this.currentEditId = null;
        this.currentCategory = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadMemosFromFirebase();
        this.setupCategoryCards();
        this.setupAuthStateListener();
    }

    bindEvents() {
        // 새 메모 버튼
        document.querySelector('.new-note-btn').addEventListener('click', () => {
            this.openModal();
        });

        // 사용자 프로필 버튼 (로그인 페이지로 이동)
        document.getElementById('userProfile').addEventListener('click', () => {
            window.location.href = 'login.html';
        });

        // 회원가입 버튼 (회원가입 페이지로 이동)
        document.getElementById('signupBtn').addEventListener('click', () => {
            window.location.href = 'signup.html';
        });

        // 로그아웃 버튼
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // 모달 닫기
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // 취소 버튼
        document.querySelector('.cancel-btn').addEventListener('click', () => {
            this.closeModal();
        });

        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // 검색 기능
        document.querySelector('.search-input').addEventListener('input', (e) => {
            this.searchMemos(e.target.value);
        });

        // 키보드 단축키
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.openModal();
            }
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // 모달 내부 이벤트
        document.getElementById('memoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMemo();
        });

        // 메모 카드 내부 이벤트 (수정, 삭제)
        document.querySelector('.notes-container').addEventListener('click', (e) => {
            const memoElement = e.target.closest('.memo');
            if (memoElement) {
                const memoId = memoElement.dataset.id;
                if (e.target.classList.contains('edit-btn')) {
                    this.openModal(memoId);
                } else if (e.target.classList.contains('delete-btn')) {
                    this.deleteMemo(memoId);
                }
            }
        });
    }

    setupCategoryCards() {
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.filterByCategory(category);
            });
        });
    }

    setupAuthStateListener() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // 로그인된 상태
                this.updateUIForLoggedInUser(user);
            } else {
                // 로그아웃된 상태
                this.updateUIForLoggedOutUser();
            }
        });
    }

    updateUIForLoggedInUser(user) {
        // 게스트 액션 숨기기
        document.getElementById('guestActions').style.display = 'none';
        
        // 사용자 액션 보이기
        document.getElementById('userActions').style.display = 'flex';
        
        // 사용자 이름 업데이트
        const userName = user.displayName || user.email.split('@')[0];
        document.getElementById('userName').textContent = userName;
        
        // 사용자 프로필 버튼 이벤트 제거 (로그인 상태에서는 필요 없음)
        const userProfile = document.getElementById('userProfile');
        if (userProfile) {
            userProfile.removeEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    }

    updateUIForLoggedOutUser() {
        // 게스트 액션 보이기
        document.getElementById('guestActions').style.display = 'flex';
        
        // 사용자 액션 숨기기
        document.getElementById('userActions').style.display = 'none';
        
        // 사용자 프로필 버튼 이벤트 다시 추가
        const userProfile = document.getElementById('userProfile');
        if (userProfile) {
            userProfile.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    }

    async handleLogout() {
        try {
            await signOut(auth);
            this.showNotification('로그아웃되었습니다.', 'success');
            
            // 2초 후 페이지 새로고침 (UI 상태 초기화를 위해)
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            console.error('로그아웃 오류:', error);
            this.showNotification('로그아웃 중 오류가 발생했습니다.', 'error');
        }
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.highlightActiveCategory(category);
        this.renderMemos();
        this.showEmptyState();
    }

    highlightActiveCategory(category) {
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
        });
        const activeCard = document.querySelector(`[data-category="${category}"]`);
        if (activeCard) {
            activeCard.classList.add('active');
        }
    }

    openModal(memoId = null) {
        const modal = document.getElementById('memoModal');
        const titleInput = document.getElementById('memoTitle');
        const contentInput = document.getElementById('memoContent');
        const categorySelect = document.getElementById('memoCategory');
        const submitBtn = document.querySelector('.save-btn');

        // 폼 초기화
        document.getElementById('memoForm').reset();
        this.currentEditId = null;

        if (memoId) {
            const memo = this.memos.find(m => m.id === memoId);
            if (memo) {
                // 현재 로그인한 사용자 확인
                const currentUser = auth.currentUser;
                if (!currentUser) {
                    this.showNotification('로그인이 필요합니다.', 'error');
                    return;
                }

                // 작성자 확인
                if (memo.authorId !== currentUser.uid) {
                    this.showNotification('자신이 작성한 메모만 수정할 수 있습니다.', 'error');
                    return;
                }

                titleInput.value = memo.title;
                contentInput.value = memo.content;
                categorySelect.value = memo.category || 'quick-notes';
                submitBtn.textContent = '수정';
                this.currentEditId = memoId;
            }
        } else {
            categorySelect.value = this.currentCategory || 'quick-notes';
            submitBtn.textContent = '저장';
        }

        modal.style.display = 'flex';
        titleInput.focus();
    }

    closeModal() {
        document.getElementById('memoModal').style.display = 'none';
        this.currentEditId = null;
    }

    saveMemo() {
        const title = document.getElementById('memoTitle').value.trim();
        const content = document.getElementById('memoContent').value.trim();
        const category = document.getElementById('memoCategory').value;

        if (!title || !content) {
            this.showNotification('제목과 내용을 모두 입력해주세요.', 'error');
            return;
        }

        // 현재 로그인한 사용자 정보 가져오기
        const currentUser = auth.currentUser;
        if (!currentUser) {
            this.showNotification('로그인이 필요합니다.', 'error');
            return;
        }

        if (this.currentEditId) {
            // 기존 메모 수정
            const memoRef = ref(database, `memos/${this.currentEditId}`);
            
            // 기존 메모 정보 가져오기
            const existingMemo = this.memos.find(m => m.id === this.currentEditId);
            if (!existingMemo) {
                this.showNotification('수정할 메모를 찾을 수 없습니다.', 'error');
                return;
            }
            
            const updatedMemo = {
                title,
                content,
                category,
                createdAt: existingMemo.createdAt, // 기존 생성일 유지
                updatedAt: new Date().toISOString(),
                authorId: existingMemo.authorId, // 기존 작성자 ID 유지
                authorName: existingMemo.authorName // 기존 작성자 이름 유지
            };
            
            set(memoRef, updatedMemo).then(() => {
                this.showNotification('메모가 수정되었습니다.', 'success');
                this.closeModal();
            }).catch((error) => {
                console.error('메모 수정 실패:', error);
                this.showNotification('메모 수정에 실패했습니다.', 'error');
            });
        } else {
            // 새 메모 생성
            const newMemo = {
                title,
                content,
                category,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                authorId: currentUser.uid,
                authorName: currentUser.displayName || currentUser.email.split('@')[0]
            };
            
            const memosRef = ref(database, 'memos');
            push(memosRef, newMemo).then(() => {
                this.showNotification('새 메모가 저장되었습니다.', 'success');
                this.closeModal();
            }).catch((error) => {
                console.error('메모 저장 실패:', error);
                this.showNotification('메모 저장에 실패했습니다.', 'error');
            });
        }
    }

    deleteMemo(memoId) {
        // 현재 로그인한 사용자 확인
        const currentUser = auth.currentUser;
        if (!currentUser) {
            this.showNotification('로그인이 필요합니다.', 'error');
            return;
        }

        // 메모 찾기
        const memo = this.memos.find(m => m.id === memoId);
        if (!memo) {
            this.showNotification('메모를 찾을 수 없습니다.', 'error');
            return;
        }

        // 작성자 확인
        if (memo.authorId !== currentUser.uid) {
            this.showNotification('자신이 작성한 메모만 삭제할 수 있습니다.', 'error');
            return;
        }

        if (confirm('정말로 이 메모를 삭제하시겠습니까?')) {
            const memoRef = ref(database, `memos/${memoId}`);
            remove(memoRef).then(() => {
                this.showNotification('메모가 삭제되었습니다.', 'success');
            }).catch((error) => {
                console.error('메모 삭제 실패:', error);
                this.showNotification('메모 삭제에 실패했습니다.', 'error');
            });
        }
    }

    searchMemos(query) {
        const filteredMemos = this.memos.filter(memo => {
            if (this.currentCategory && memo.category !== this.currentCategory) {
                return false;
            }
            return memo.title.toLowerCase().includes(query.toLowerCase()) ||
                   memo.content.toLowerCase().includes(query.toLowerCase());
        });

        this.renderMemos(filteredMemos);
        this.showEmptyState(filteredMemos);
    }

    renderMemos(memosToRender = null) {
        const container = document.querySelector('.notes-container');
        const memos = memosToRender || this.memos;

        // 카테고리 필터링
        if (this.currentCategory) {
            const filteredMemos = memos.filter(memo => memo.category === this.currentCategory);
            this.renderMemoList(container, filteredMemos);
        } else {
            this.renderMemoList(container, memos);
        }
    }

    renderMemoList(container, memos) {
        container.innerHTML = '';
        memos.forEach(memo => {
            const memoElement = this.createMemoElement(memo);
            container.appendChild(memoElement);
        });
    }

    createMemoElement(memo) {
        const memoDiv = document.createElement('div');
        memoDiv.className = 'memo';
        memoDiv.dataset.category = memo.category;
        memoDiv.dataset.id = memo.id; // ID를 dataset에 저장

        const categoryClass = memo.category ? `${memo.category}-memo` : '';
        if (categoryClass) {
            memoDiv.classList.add(categoryClass);
        }

        // 현재 로그인한 사용자 정보
        const currentUser = auth.currentUser;
        const isAuthor = currentUser && memo.authorId === currentUser.uid;

        memoDiv.innerHTML = `
            <div class="memo-header">
                <h3 class="memo-title">${this.escapeHtml(memo.title)}</h3>
                <div class="memo-actions">
                    ${isAuthor ? `
                        <button class="edit-btn" data-id="${memo.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" data-id="${memo.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : `
                        <span class="read-only-badge">읽기 전용</span>
                    `}
                </div>
            </div>
            <div class="memo-content">${this.escapeHtml(memo.content)}</div>
            <div class="memo-footer">
                <span class="memo-date">${this.formatDate(new Date(memo.updatedAt))}</span>
                <span class="memo-category-badge">${this.getCategoryDisplayName(memo.category)}</span>
                <span class="memo-author">작성자: ${memo.authorName ? this.escapeHtml(memo.authorName) : '(없음)'}</span>
            </div>
        `;

        return memoDiv;
    }

    getCategoryDisplayName(category) {
        const categoryNames = {
            'journal': 'Journal',
            'quick-notes': 'Quick Notes',
            'questionnaires': 'Questionnaires',
            'goals': 'Life Systems & Goals'
        };
        return categoryNames[category] || category;
    }

    updateCategoryDates() {
        const categories = ['journal', 'quick-notes', 'questionnaires', 'goals'];
        categories.forEach(category => {
            const categoryMemos = this.memos.filter(memo => memo.category === category);
            if (categoryMemos.length > 0) {
                const latestMemo = categoryMemos.reduce((latest, current) => {
                    return new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest;
                });
                const dateElement = document.getElementById(`${category}Date`);
                if (dateElement) {
                    dateElement.textContent = this.formatDate(new Date(latestMemo.updatedAt));
                }
            }
        });
    }

    showEmptyState(memos = null) {
        const container = document.querySelector('.notes-container');
        const memosToCheck = memos || this.memos;
        
        if (memosToCheck.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note"></i>
                    <p>아직 메모가 없습니다.</p>
                    <p>새로운 메모를 작성해보세요!</p>
                </div>
            `;
        } else if (this.currentCategory && memosToCheck.filter(m => m.category === this.currentCategory).length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>이 카테고리에 메모가 없습니다.</p>
                    <p>새로운 메모를 작성해보세요!</p>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // 애니메이션 효과
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // 자동 제거
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today';
        } else if (diffDays === 2) {
            return 'Yesterday';
        } else if (diffDays <= 7) {
            return `${diffDays - 1} days ago`;
        } else {
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    // Firebase에서 메모 로드
    loadMemosFromFirebase() {
        const memosRef = ref(database, 'memos');
        onValue(memosRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                this.memos = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
            } else {
                this.memos = [];
            }
            this.renderMemos();
            this.showEmptyState();
            this.updateCategoryDates();
        });
    }

    // localStorage 관련 메서드 제거 (Firebase 사용으로 대체)
    saveToLocalStorage() {
        // Firebase를 사용하므로 이 메서드는 더 이상 필요하지 않음
    }
}

// 앱 초기화
const memoApp = new MemoApp();
