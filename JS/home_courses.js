document.addEventListener('DOMContentLoaded', () => {

    const subjectsDB = {
        kindergarten: [
            { id: 'kg1', title: 'Alphabet', description: 'Learning the alphabet from A to Z.', icon: 'A', color: '#f78f8f' },
            { id: 'kg2', title: 'Numbers', description: 'Counting and basic number concepts.', icon: '1', color: '#fcc17e' },
            { id: 'kg3', title: 'Colors', description: 'Identifying and naming primary colors.', icon: 'C', color: '#f9ff97' },
            { id: 'kg4', title: 'Shapes', description: 'Recognizing circles, squares, and triangles.', icon: 'S', color: '#aef7a1' },
        ],
        highschool: [
            { id: 'hs1', title: 'Standard One', description: 'A foundation reflecting 7 important concepts.', icon: '1', color: '#f78f8f' },
            { id: 'hs2', title: 'Standard Two', description: 'Builds on the foundations of Standard 1.', icon: '2', color: '#fcc17e' },
            { id: 'hs3', title: 'Standard Three', description: 'Applies to all services delivering personal care.', icon: '3', color: '#f9ff97' },
            { id: 'hs4', title: 'Standard Four', description: 'Focuses on service and support for daily living.', icon: '4', color: '#aef7a1' },
            { id: 'hs5', title: 'Standard Five', description: 'Learning Resources ensure the school has the resources.', icon: '5', color: '#74f2ff' },
            { id: 'hs6', title: 'Standard Six', description: 'Requires an organisation to have a system.', icon: '6', color: '#8ab6f9' },
            { id: 'hs7', title: 'Standard Seven', description: 'Mandates that leaders of health service.', icon: '7', color: '#a699f7' },
            { id: 'hs8', title: 'Standard Eight', description: 'Course from NCERT Solutions help students.', icon: '8', color: '#ffc6ff' },
            { id: 'hs9', title: 'Standard Nine', description: 'Defines governance, leadership and culture.', icon: '9', color: '#f1c0e8' },
            { id: 'hs10', title: 'O-Level', description: 'Prepares students for further academic pursuits.', icon: 'O', color: '#cfbaf0' },
            { id: 'hs11', title: 'A-Level', description: 'Advanced level qualifications for university entry.', icon: 'A', color: '#a3c4f3' },
        ],
        college: [
             { id: 'cl1', title: 'Calculus', description: 'Advanced mathematical concepts for university.', icon: 'C', color: '#8ab6f9' },
             { id: 'cl2', title: 'Physics', description: 'Understanding the physical world and its laws.', icon: 'P', color: '#a699f7' },
             { id: 'cl3', title: 'Literature', description: 'Analysis of classic and modern texts.', icon: 'L', color: '#ffc6ff' },
             { id: 'cl4', title: 'History', description: 'Studying past events and their impact.', icon: 'H', color: '#f1c0e8' },
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

    const filterBtns = document.querySelectorAll('.popular-classes-section .filter-btn');
    const classesGrid = document.getElementById('home-classes-grid');
    const viewMoreBtn = document.getElementById('view-more-btn');

    let isShowingAll = false;

    const renderClasses = (classes) => {
        classesGrid.innerHTML = '';
        
        const classesToShow = isShowingAll ? classes : classes.slice(0, 8);
        
        viewMoreBtn.style.display = classes.length > 8 ? 'inline-block' : 'none';

        classesToShow.forEach(subject => {
            const classCard = document.createElement('div');
            classCard.className = 'class-card';
            classCard.innerHTML = `
                <div class="class-icon" style="background-color: ${subject.color};">${subject.icon}</div>
                <h3 class="class-title">${subject.title}</h3>
                <p class="class-description">${subject.description}</p>
                <button class="class-details-btn">Class Details</button>
            `;
            classesGrid.appendChild(classCard);
        });
    };

    const updateView = () => {
        const activeBtn = document.querySelector('.popular-classes-section .filter-btn.active');
        const activeCategory = activeBtn.dataset.category;

        let classesForCategory;

        // UPDATED: Handle the 'all' category
        if (activeCategory === 'all') {
            // Combine all subjects from all categories into one array
            classesForCategory = Object.values(subjectsDB).flat();
        } else {
            classesForCategory = subjectsDB[activeCategory] || [];
        }
        
        renderClasses(classesForCategory);
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if(!btn.dataset.category) return; // Ignore "More Courses" button
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            isShowingAll = false;
            viewMoreBtn.textContent = 'View More Classes';
            
            updateView();
        });
    });

    viewMoreBtn.addEventListener('click', () => {
        isShowingAll = !isShowingAll;
        viewMoreBtn.textContent = isShowingAll ? 'Show Less' : 'View More Classes';
        updateView();
    });

    // Initial render when the page loads
    updateView();
});