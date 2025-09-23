document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK DATABASE (WITH UPDATED INR PRICING) ---
    const subjectsDB = {
        kindergarten: [
            { id: 'kg1', title: 'Alphabet', description: 'Learning the alphabet from A to Z.', icon: 'A', color: '#f78f8f' },
            { id: 'kg2', title: 'Numbers', description: 'Counting and basic number concepts.', icon: '1', color: '#fcc17e' },
        ],
        highschool: [
            { id: 'hs1', title: 'Standard One', description: 'A foundation reflecting 7 important concepts.', icon: '1', color: '#f78f8f' },
            { id: 'hs2', title: 'Standard Two', description: 'Builds on the foundations of Standard 1.', icon: '2', color: '#fcc17e' },
            { id: 'hs3', title: 'Standard Three', description: 'Applies to all services delivering personal care.', icon: '3', color: '#f9ff97' },
            { id: 'hs4', title: 'Standard Four', description: 'Focuses on service and support for daily living.', icon: '4', color: '#aef7a1' },
        ],
        college: [
             { id: 'cl1', title: 'Calculus', description: 'Advanced mathematical concepts for university.', icon: 'C', color: '#8ab6f9' },
             { id: 'cl2', title: 'Physics', description: 'Understanding the physical world and its laws.', icon: 'P', color: '#a699f7' },
        ],
        computer: [
             { id: 'cs1', title: 'Programming', description: 'Learn to code in Python and JavaScript.', icon: 'P', color: '#74f2ff' },
             { id: 'cs2', title: 'Networking', description: 'Understand how the internet and networks work.', icon: 'N', color: '#8ab6f9' },
        ],
        science: [
            { id: 'sci1', title: 'Biology', description: 'The study of life and living organisms.', icon: 'B', color: '#8cc8ca' },
            { id: 'sci2', title: 'Chemistry', description: 'The science of matter and its properties.', icon: 'C', color: '#3a6a8a' },
        ],
        engineering: [
            { id: 'eng1', title: 'Mechanics', description: 'The study of motion, forces, and energy.', icon: 'M', color: '#e6910a' },
            { id: 'eng2', title: 'Circuits', description: 'The fundamentals of electrical circuits.', icon: 'E', color: '#101a30' },
        ]
    };

    const coursesDB = [
        // Kindergarten Courses
        { id: 1, subjectId: 'kg1', category: 'kindergarten', title: 'Fun with Phonics', rating: 5, price: 499, image: 'https://placehold.co/300x200/ffadad/000?text=Phonics' },
        { id: 2, subjectId: 'kg1', category: 'kindergarten', title: 'Alphabet Stories', rating: 4, price: 449, image: 'https://placehold.co/300x200/ffadad/000?text=Stories' },
        { id: 3, subjectId: 'kg2', category: 'kindergarten', title: 'Counting to 100', rating: 5, price: 599, image: 'https://placehold.co/300x200/ffd6a5/000?text=1-100' },
        { id: 4, subjectId: 'kg2', category: 'kindergarten', title: 'Simple Addition', rating: 4, price: 549, image: 'https://placehold.co/300x200/ffd6a5/000?text=1+1' },
        // High School Courses
        { id: 5, subjectId: 'hs1', category: 'highschool', title: 'The Three Musketeers', rating: 5, price: 999, image: 'https://placehold.co/300x200/fca311/ffffff?text=Course' },
        { id: 6, subjectId: 'hs1', category: 'highschool', title: 'History of Ancient Rome', rating: 4, price: 899, image: 'https://placehold.co/300x200/14213d/ffffff?text=Course' },
        { id: 7, subjectId: 'hs2', category: 'highschool', title: 'Introduction to Algebra', rating: 5, price: 1299, image: 'https://placehold.co/300x200/003049/ffffff?text=Course' },
        { id: 8, subjectId: 'hs2', category: 'highschool', title: 'Basic Geometry', rating: 3, price: 799, image: 'https://placehold.co/300x200/d62828/ffffff?text=Course' },
        { id: 9, subjectId: 'hs3', category: 'highschool', title: 'World War II History', rating: 5, price: 999, image: 'https://placehold.co/300x200/f77f00/ffffff?text=Course' },
        { id: 10, subjectId: 'hs3', category: 'highschool', title: 'The American Revolution', rating: 4, price: 899, image: 'https://placehold.co/300x200/f77f00/ffffff?text=Course' },
        { id: 11, subjectId: 'hs4', category: 'highschool', title: 'Biology Basics', rating: 5, price: 1499, image: 'https://placehold.co/300x200/2a9d8f/ffffff?text=Course' },
        { id: 12, subjectId: 'hs4', category: 'highschool', title: 'Intro to Chemistry', rating: 4, price: 1399, image: 'https://placehold.co/300x200/2a9d8f/ffffff?text=Course' },
        // College Courses
        { id: 13, subjectId: 'cl1', category: 'college', title: 'Advanced Calculus', rating: 5, price: 2499, image: 'https://placehold.co/300x200/a0c4ff/000?text=Calculus' },
        { id: 14, subjectId: 'cl1', category: 'college', title: 'Linear Algebra', rating: 4, price: 2299, image: 'https://placehold.co/300x200/a0c4ff/000?text=Algebra' },
        { id: 15, subjectId: 'cl2', category: 'college', title: 'Quantum Physics', rating: 5, price: 2999, image: 'https://placehold.co/300x200/bdb2ff/000?text=Physics' },
        { id: 16, subjectId: 'cl2', category: 'college', title: 'Thermodynamics', rating: 4, price: 2799, image: 'https://placehold.co/300x200/bdb2ff/000?text=Thermo' },
        // Computer Courses
        { id: 17, subjectId: 'cs1', category: 'computer', title: 'Python for Beginners', rating: 5, price: 1999, image: 'https://placehold.co/300x200/9bf6ff/000?text=Python' },
        { id: 18, subjectId: 'cs1', category: 'computer', title: 'JavaScript Essentials', rating: 5, price: 1999, image: 'https://placehold.co/300x200/9bf6ff/000?text=JS' },
        { id: 19, subjectId: 'cs2', category: 'computer', title: 'Cybersecurity Basics', rating: 4, price: 2499, image: 'https://placehold.co/300x200/a0c4ff/000?text=Security' },
        { id: 20, subjectId: 'cs2', category: 'computer', title: 'Cloud Computing (AWS)', rating: 4, price: 2999, image: 'https://placehold.co/300x200/a0c4ff/000?text=AWS' },
        // Science Courses
        { id: 21, subjectId: 'sci1', category: 'science', title: 'Genetics and Evolution', rating: 5, price: 1599, image: 'https://placehold.co/300x200/a8dadc/000?text=Genetics' },
        { id: 22, subjectId: 'sci1', category: 'science', title: 'Cellular Biology', rating: 4, price: 1499, image: 'https://placehold.co/300x200/a8dadc/000?text=Cells' },
        { id: 23, subjectId: 'sci2', category: 'science', title: 'Organic Chemistry', rating: 5, price: 1799, image: 'https://placehold.co/300x200/457b9d/FFF?text=Chemistry' },
        { id: 24, subjectId: 'sci2', category: 'science', title: 'The Periodic Table', rating: 4, price: 1699, image: 'https://placehold.co/300x200/457b9d/FFF?text=Elements' },
        // Engineering Courses
        { id: 25, subjectId: 'eng1', category: 'engineering', title: 'Statics and Dynamics', rating: 5, price: 3499, image: 'https://placehold.co/300x200/fca311/000?text=Statics' },
        { id: 26, subjectId: 'eng1', category: 'engineering', title: 'Materials Science', rating: 4, price: 3299, image: 'https://placehold.co/300x200/fca311/000?text=Materials' },
        { id: 27, subjectId: 'eng2', category: 'engineering', title: 'Analog Circuits', rating: 5, price: 3999, image: 'https://placehold.co/300x200/14213d/FFF?text=Circuits' },
        { id: 28, subjectId: 'eng2', category: 'engineering', title: 'Digital Logic Design', rating: 4, price: 3799, image: 'https://placehold.co/300x200/14213d/FFF?text=Logic' },
    ];

    const standardClassesSection = document.getElementById('standard-classes-section');
    const standardClassesGrid = document.getElementById('standard-classes-grid');
    const courseGrid = document.getElementById('course-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('search-suggestions');
    const noResultsMessage = document.getElementById('no-results');
    
    let highlightedSuggestionIndex = -1;

    const renderSubjects = (subjects) => {
        standardClassesGrid.innerHTML = '';
        if (!subjects || subjects.length === 0) {
            standardClassesSection.style.display = 'none';
            return;
        }
        subjects.forEach(subject => {
            const subjectCard = document.createElement('div');
            subjectCard.className = 'class-card';
            subjectCard.innerHTML = `<div class="class-icon" style="background-color: ${subject.color};">${subject.icon}</div><h3 class="class-title">${subject.title}</h3><p class="class-description">${subject.description}</p><a href="classes.html" class="class-details-btn">Class Details</a>`;
            standardClassesGrid.appendChild(subjectCard);
        });
        standardClassesSection.style.display = 'block';
    };

    const renderCourses = (courses) => {
        courseGrid.innerHTML = '';
        noResultsMessage.style.display = courses.length === 0 ? 'block' : 'none';
        
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            // UPDATED: Added the details button and changed '$' to '₹'
            courseCard.innerHTML = `
                <img src="${course.image}" alt="${course.title}" class="course-image">
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <div class="course-rating">${'★'.repeat(course.rating)}${'☆'.repeat(5 - course.rating)}</div>
                    <div class="course-footer">
                        <span class="course-price">₹${course.price.toFixed(2)}</span>
                        <a href="classes.html" class="details-btn">Class Details</a>
                    </div>
                </div>`;
            courseGrid.appendChild(courseCard);
        });
    };

    const filterAndRender = () => {
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
        const searchTerm = searchInput.value.toLowerCase();
        
        let coursesToDisplay = coursesDB;
        let subjectsToDisplay = [];
        
        if (activeCategory !== 'all') {
            subjectsToDisplay = subjectsDB[activeCategory];
            coursesToDisplay = coursesDB.filter(course => course.category === activeCategory);
        } else {
            subjectsToDisplay = Object.values(subjectsDB).flat();
        }

        renderSubjects(subjectsToDisplay);

        if (searchTerm) {
            coursesToDisplay = coursesToDisplay.filter(course => course.title.toLowerCase().includes(searchTerm));
        }
        
        renderCourses(coursesToDisplay);
    };

    const updateSuggestionHighlight = () => {
        const items = searchSuggestions.querySelectorAll('.suggestion-item');
        items.forEach((item, index) => {
            if (index === highlightedSuggestionIndex) {
                item.classList.add('highlighted');
            } else {
                item.classList.remove('highlighted');
            }
        });
    };
    
    const showSuggestions = () => {
        const term = searchInput.value.toLowerCase();
        searchSuggestions.innerHTML = '';
        highlightedSuggestionIndex = -1;

        if (!term) {
            searchSuggestions.style.display = 'none';
            filterAndRender(); 
            return;
        }

        const matchingCourses = coursesDB
            .filter(course => course.title.toLowerCase().includes(term))
            .slice(0, 5);

        if (matchingCourses.length > 0) {
            matchingCourses.forEach(course => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = course.title;
                item.onclick = () => {
                    searchInput.value = course.title;
                    searchSuggestions.style.display = 'none';
                    filterAndRender();
                };
                searchSuggestions.appendChild(item);
            });
            searchSuggestions.style.display = 'block';
        } else {
            searchSuggestions.style.display = 'none';
        }
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.dataset.category) return;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAndRender();
        });
    });

    searchInput.addEventListener('input', showSuggestions);

    searchInput.addEventListener('keydown', (e) => {
        const items = searchSuggestions.querySelectorAll('.suggestion-item');
        if (searchSuggestions.style.display === 'none' || items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightedSuggestionIndex = (highlightedSuggestionIndex + 1) % items.length;
            updateSuggestionHighlight();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightedSuggestionIndex = (highlightedSuggestionIndex - 1 + items.length) % items.length;
            updateSuggestionHighlight();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedSuggestionIndex > -1) {
                items[highlightedSuggestionIndex].click();
            } else {
                filterAndRender();
                searchSuggestions.style.display = 'none';
            }
        } else if (e.key === 'Escape') {
            searchSuggestions.style.display = 'none';
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            searchSuggestions.style.display = 'none';
        }
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
        filterAndRender();
        searchSuggestions.style.display = 'none';
    });
    
    filterAndRender();
});