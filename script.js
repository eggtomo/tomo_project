
        const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY;

      // ⭐ Kakao Maps SDK 동적 로드
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}`;
      document.head.appendChild(script);

      script.onload = () => {
        console.log("Kakao SDK Loaded");
        initMap();
      };
        
        // 서울 4호선 지하철역 목록
         const line4Stations = [
            '당고개역', '상계역', '노원역', '창동역', '쌍문역', '수유역', '미아역', 
            '미아사거리역', '길음역', '성신여대입구역', '한성대입구역', '혜화역', 
            '동대문역', '동대문역사문화공원역', '충무로역', '명동역', '회현역', 
            '서울역', '숙대입구역', '삼각지역', '신용산역', '이촌역', '동작역', 
            '총신대입구(이수)역', '사당역', '남태령역', '선바위역', '경마공원역', 
            '대공원역', '과천역', '정부과천청사역', '인덕원역', '평촌역', '범계역', 
            '금정역', '산본역', '수리산역', '대야미역', '반월역', '상록수역', 
            '한대앞역', '중앙역', '고잔역', '초지역', '안산역', '신길온천역', 
            '정왕역', '오이도역'
        ];

        // 4호선 주요 역 좌표 (테스트용 5개)
        const stationCoords = {
            
            "당고개역": { lat: 37.670272, lng: 127.080183 },
            "상계역": { lat: 37.660878, lng: 127.073572 },
            "노원역": { lat: 37.655128, lng: 127.061368 },
            "창동역": { lat: 37.653166, lng: 127.047731 },
            "쌍문역": { lat: 37.648608, lng: 127.034583 },
            "수유역": { lat: 37.638052, lng: 127.025732 },
            "미아역": { lat: 37.626670, lng: 127.025983 },
            "미아사거리역": { lat: 37.613292, lng: 127.030092 },
            "길음역": { lat: 37.603407, lng: 127.025053 },
            "성신여대입구역": { lat: 37.592624, lng: 127.016403 },
            "한성대입구역": { lat: 37.588458, lng: 127.006221 },
            "혜화역": { lat: 37.582336, lng: 127.001844 },
            "동대문역": { lat: 37.571356, lng: 127.009328 },
            "동대문역사문화공원역": { lat: 37.564718, lng: 127.005220 },
            "충무로역": { lat: 37.561235, lng: 126.994975 },
            "명동역": { lat: 37.560989, lng: 126.986325 },
            "회현역": { lat: 37.558514, lng: 126.978246 },
            "서울역": { lat: 37.554648, lng: 126.972559 },
            "숙대입구역": { lat: 37.544588, lng: 126.972148 },
            "삼각지역": { lat: 37.534488, lng: 126.972559 },
            "신용산역": { lat: 37.529116, lng: 126.967700 },
            "이촌역": { lat: 37.522272, lng: 126.974345 },
            "동작역": { lat: 37.502971, lng: 126.979306 },
            "총신대입구(이수)역": { lat: 37.486263, lng: 126.981989 },
            "사당역": { lat: 37.476922, lng: 126.981672 },
            "남태령역": { lat: 37.463863, lng: 126.989134 },
            "선바위역": { lat: 37.451673, lng: 127.002303 },
            "경마공원역": { lat: 37.443885, lng: 127.007888 },
            "대공원역": { lat: 37.435675, lng: 127.006523 },
            "과천역": { lat: 37.426684, lng: 126.989591 },
            "정부과천청사역": { lat: 37.426052, lng: 126.987564 },
            "인덕원역": { lat: 37.401553, lng: 126.976715 },
            "평촌역": { lat: 37.394287, lng: 126.963883 },
            "범계역": { lat: 37.389793, lng: 126.949212 },
            "금정역": { lat: 37.372221, lng: 126.943158 },
            "산본역": { lat: 37.358170, lng: 126.933522 },
            "수리산역": { lat: 37.349801, lng: 126.925365 },
            "대야미역": { lat: 37.342247, lng: 126.917332 },
            "반월역": { lat: 37.312920, lng: 126.903915 },
            "상록수역": { lat: 37.302795, lng: 126.866489 },
            "한대앞역": { lat: 37.309689, lng: 126.853440 },
            "중앙역": { lat: 37.316829, lng: 126.838560 },
            "고잔역": { lat: 37.316162, lng: 126.823388 },
            "초지역": { lat: 37.320646, lng: 126.805914 },
            "안산역": { lat: 37.327030, lng: 126.788805 },
            "신길온천역": { lat: 37.335529, lng: 126.743380 },
            "정왕역": { lat: 37.351735, lng: 126.742989 },
            "오이도역": { lat: 37.362357, lng: 126.738560 }
        };

        // 게시글 저장소
        let posts = [];

        const saved = localStorage.getItem("eggtomoPosts");
        if (saved) {
          posts = JSON.parse(saved);
        }
        
        // Kakao 지도 객체
        let map = null;
        let markers = [];
        let circles = [];

        // 이미지 업로드 미리보기
        document.getElementById('imageUpload').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = document.getElementById('previewImg');
                    const placeholder = document.querySelector('.preview-placeholder');
                    img.src = event.target.result;
                    img.style.display = 'block';
                    placeholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });

        // 자동완성 기능
        const locationInput = document.getElementById('location');
        const autocompleteList = document.getElementById('autocompleteList');

        locationInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            autocompleteList.innerHTML = '';
            
            if (value.length === 0) {
                autocompleteList.classList.remove('active');
                return;
            }

            const filtered = line4Stations.filter(station => 
                station.toLowerCase().includes(value)
            );

            if (filtered.length > 0) {
                filtered.forEach(station => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.textContent = station;
                    item.addEventListener('click', function() {
                        locationInput.value = station;
                        autocompleteList.classList.remove('active');
                    });
                    autocompleteList.appendChild(item);
                });
                autocompleteList.classList.add('active');
            } else {
                autocompleteList.classList.remove('active');
            }
        });

        // 외부 클릭 시 자동완성 닫기
        document.addEventListener('click', function(e) {
            if (!locationInput.contains(e.target) && !autocompleteList.contains(e.target)) {
                autocompleteList.classList.remove('active');
            }
        });

        // 등록하기 버튼 클릭 이벤트
        document.getElementById('submitBtn').addEventListener('click', function() {
            // 입력값 가져오기
            const imageElement = document.getElementById('previewImg');
            const name = document.getElementById('eggName').value.trim();
            const location = document.getElementById('location').value.trim();
            const email = document.getElementById('email').value.trim();

            // 유효성 검사
            if (!imageElement.src || imageElement.style.display === 'none') {
                alert('계란토모 이미지를 업로드해주세요! 📷');
                return;
            }

            if (!name) {
                alert('계란토모 이름을 입력해주세요! 🐣');
                return;
            }

            if (!location) {
                alert('위치(지하철역)를 선택해주세요! 🚇');
                return;
            }

            if (!line4Stations.includes(location)) {
                alert('서울 4호선 지하철역만 선택 가능합니다!');
                return;
            }

            // 좌표 데이터가 있는지 확인 (테스트용)
            if (!stationCoords[location]) {
                alert(`⚠️ "${location}"는 아직 지도에 표시할 수 없습니다.\n4호선 라인만 선택 가능`);
                return;
            }

            if (!email) {
                alert('이메일 주소를 입력해주세요! 📧');
                return;
            }

            // 이메일 형식 검사
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('올바른 이메일 형식이 아닙니다!');
                return;
            }

            // 게시글 데이터 생성
            const post = {
                id: Date.now(),
                image: imageElement.src,
                name: name,
                location: location,
                email: email,
                timestamp: new Date().toLocaleString('en-US', { hour12: true }),
                coords: stationCoords[location] // 좌표 추가
            };

            // 게시글 추가
            posts.unshift(post);
            //게시글 저장되게
            localStorage.setItem("eggtomoPosts", JSON.stringify(posts));

            renderPosts();
            updateMap(); // 지도 업데이트

            // 성공 메시지
            alert('✅ 계란토모가 등록되었습니다!');

            // 입력 폼 초기화
            resetForm();
        });

        // 게시글 렌더링 함수
        function renderPosts() {
            const postList = document.getElementById('postList');
            
            if (posts.length === 0) {
                postList.innerHTML = `
                    <div style="text-align: center; color: #999; padding: 40px 20px;">
                        아직 등록된 계란토모가 없습니다.<br>
                        위 디바이스에서 등록해주세요! 🐣
                    </div>
                `;
                return;
            }

            postList.innerHTML = posts.map(post => `
                <div class="post-card">
                    <div class="post-header">
                        <img src="${post.image}" alt="${post.name}" class="post-image">
                        <div class="post-info">
                            <div class="post-name">🐣 ${post.name}</div>
                            <div class="post-location">📍 ${post.location}</div>
                        </div>
                    </div>
                    <div class="post-email">📧 ${post.email}</div>
                    <div class="post-time">${post.timestamp}</div>
                </div>
            `).join('');
        }

        // 지도 초기화
        function initMap() {
            const container = document.getElementById('map');
            const options = {
                center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
                level: 8 // 확대 레벨
            };
            map = new kakao.maps.Map(container, options);
        }

        // 지도 업데이트 (게시글 위치 표시)
        function updateMap() {
            if (!map) return;

            // 기존 마커와 원 제거
            markers.forEach(marker => marker.setMap(null));
            circles.forEach(circle => circle.setMap(null));
            markers = [];
            circles = [];

            // 게시글이 없으면 리턴
            if (posts.length === 0) return;

            // 각 게시글 위치에 마커와 5km 원 표시
            posts.forEach(post => {
                const position = new kakao.maps.LatLng(post.coords.lat, post.coords.lng);

                // 마커 생성
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: position
                });

                // 인포윈도우 생성 (클릭 시 정보 표시)
                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:10px;font-size:12px;text-align:center;">
                                <strong>🐣 ${post.name}</strong><br>
                                📍 ${post.location}
                              </div>`
                });

                // 마커 클릭 이벤트
                kakao.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                });

                markers.push(marker);

                // 5km 반경 원 표시
                const circle = new kakao.maps.Circle({
                    center: position,
                    radius: 7000, // 5km
                    strokeWeight: 2,
                    strokeColor: '#00ff41',
                    strokeOpacity: 0.8,
                    strokeStyle: 'solid',
                    fillColor: '#00ff41',
                    fillOpacity: 0.15
                });

                circle.setMap(map);
                circles.push(circle);
            });

            // 첫 번째 게시글 위치로 지도 중심 이동
            if (posts.length > 0) {
                const firstPost = posts[0];
                const moveLatLon = new kakao.maps.LatLng(firstPost.coords.lat, firstPost.coords.lng);
                map.setCenter(moveLatLon);
                map.setLevel(7);
            }
        }

        // 폼 초기화 함수
        function resetForm() {
            document.getElementById('imageUpload').value = '';
            document.getElementById('previewImg').style.display = 'none';
            document.getElementById('previewImg').src = '';
            document.querySelector('.preview-placeholder').style.display = 'block';
            document.getElementById('eggName').value = '';
            document.getElementById('location').value = '';
            document.getElementById('email').value = '';
        }

        // 페이지 로드 시 초기화
        kakao.maps.load(function () {
          initMap();
          renderPosts();
        });

