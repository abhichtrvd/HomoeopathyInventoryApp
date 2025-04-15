document.addEventListener("DOMContentLoaded", function () {
    // Define datasets for each medicine company without the `id` field
    const medicineData = {
        sblDil: [
            { name: 'Arnica', potency: '200', category: 'Dilution', company: 'SBL', packingSize: '30ml', count: 10 },
            { name: 'Hypericum', potency: '1000', category: 'Dilution', company: 'SBL', packingSize: '100ml', count: 20 },
            { name: 'Calcarea Carbonica', potency: '200', category: 'Dilution', company: 'SBL', packingSize: 'Pound', count: 5 },
            { name: 'Ferrum Phos', potency: '30', category: 'Dilution', company: 'SBL', packingSize: 'Combo', count: 15 },
            { name: 'Arnica', potency: '30', category: 'Dilution', company: 'SBL', packingSize: '100ml', count: 15 },
        ],
        rwDil: [
            { name: 'Causticum', potency: '30', category: 'Dilution', company: 'RW', packingSize: '11ml', count: 8 },
        ],
        sblMT: [
            { name: 'Arnica', potency: '1000', category: 'Mother Tincture', company: 'SBL', packingSize: '30ml', count: 12 },
            { name: 'Calendula', potency: '200', category: 'Mother Tincture', company: 'SBL', packingSize: '100ml', count: 7 },
        ],
        rwMT: [
            { name: 'Arnica', potency: '500', category: 'Mother Tincture', company: 'RW', packingSize: '20ml', count: 4 },
            { name: 'Calendula', potency: '1000', category: 'Mother Tincture', company: 'RW', packingSize: '100ml', count: 5 },
        ],
    };

    // Function to update the inventory table based on selected packing sizes and company
    function updateInventoryTable(selectedPackingSizes, selectedCompany, category) {
        const inventoryTableBody = document.getElementById('inventoryTableBody');

        // Clear table before populating
        inventoryTableBody.innerHTML = '';

        // Loop over each packing size selected
        selectedPackingSizes.forEach(packingSize => {
            for (const key in medicineData) {
                if ((category === 'Dilution' && key.includes('Dil')) || (category === 'Mother Tincture' && key.includes('MT'))) {
                    medicineData[key].forEach(medicine => {
                        if (medicine.packingSize === packingSize && medicine.company === selectedCompany) {
                            // Check if the medicine is already in the table
                            if (!document.querySelector(`tr[data-name="${medicine.name}"][data-potency="${medicine.potency}"][data-packingSize="${medicine.packingSize}"]`)) {
                                const row = document.createElement('tr');
                                row.setAttribute('data-name', medicine.name);
                                row.setAttribute('data-potency', medicine.potency);
                                row.setAttribute('data-packingSize', medicine.packingSize);
                                row.setAttribute('data-category', category);
                                row.setAttribute('data-company', selectedCompany);
                                row.innerHTML = `
                                    <td>${medicine.name}</td>
                                    <td>${medicine.potency}</td>
                                    <td>${medicine.category}</td>
                                    <td>${medicine.company}</td>
                                    <td>${medicine.packingSize}</td>
                                    <td>
                                        <span id="count-${medicine.name}-${medicine.potency}-${medicine.packingSize}">${medicine.count}</span>
                                    </td>
                                    <td>
                                        <button class="decrease-btn">-</button>
                                        <button class="increase-btn">+</button>
                                        <button class="edit-btn" data-name="${medicine.name}" data-potency="${medicine.potency}" data-packingSize="${medicine.packingSize}">Edit</button>
                                    </td>
                                `;
                                inventoryTableBody.appendChild(row);
                            }
                        }
                    });
                }
            }
        });

        // Attach event listeners to buttons after they are added to the DOM
        attachButtonListeners();
        attachEditListeners();
    }

    // Function to update count and check stock status
    function updateCount(name, potency, packingSize, delta) {
        const medicine = findMedicineByAttributes(name, potency, packingSize);
        if (medicine) {
            if (medicine.count + delta >= 0) {
                medicine.count += delta;
                document.getElementById(`count-${name}-${potency}-${packingSize}`).innerText = medicine.count;

                // Determine new category based on updated count
                updateRowCategory(name, potency, packingSize);
            }
        }
    }

    // After populating the table, attach event listeners for the edit buttons
    function attachEditListeners() {
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', function () {
                const name = button.getAttribute('data-name');
                const potency = button.getAttribute('data-potency');
                const packingSize = button.getAttribute('data-packingSize');
                editMedicine(name, potency, packingSize);
            });
        });
    }



    // Function to update the row's category based on the current count
    function updateRowCategory(name, potency, packingSize) {
        const medicine = findMedicineByAttributes(name, potency, packingSize);
        const row = document.querySelector(`tr[data-name="${name}"][data-potency="${potency}"][data-packingSize="${packingSize}"]`);
        const count = medicine.count;

        // Update row's category based on count
        if (count === 0) {
            row.setAttribute('data-category', 'Out of Stock');
        } else if (count <= 5) {
            row.setAttribute('data-category', 'Low Stock');
        } else {
            row.setAttribute('data-category', 'High Stock');
        }
    }

    // Function to find a medicine by its attributes
    function findMedicineByAttributes(name, potency, packingSize) {
        for (const category in medicineData) {
            const medicine = medicineData[category].find(med => med.name === name && med.potency === potency && med.packingSize === packingSize);
            if (medicine) return medicine;
        }
        return null;
    }

    // Function to attach event listeners for dynamically created buttons
    function attachButtonListeners() {
        const decreaseButtons = document.querySelectorAll('.decrease-btn');
        const increaseButtons = document.querySelectorAll('.increase-btn');

        decreaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const row = button.closest('tr');
                const name = row.getAttribute('data-name');
                const potency = row.getAttribute('data-potency');
                const packingSize = row.getAttribute('data-packingSize');
                console.log(`Decreasing count for: ${name}, ${potency}, ${packingSize}`);
                updateCount(name, potency, packingSize, -1);
            });
        });

        increaseButtons.forEach(button => {
            button.addEventListener('click', function () {
                const row = button.closest('tr');
                const name = row.getAttribute('data-name');
                const potency = row.getAttribute('data-potency');
                const packingSize = row.getAttribute('data-packingSize');
                console.log(`Increasing count for: ${name}, ${potency}, ${packingSize}`);
                updateCount(name, potency, packingSize, 1);
            });
        });
    }

    // Function to handle checkbox changes for Dilution and Mother Tincture
    function handleCategoryCheckboxChange() {
        const dilutionCheckbox = document.getElementById('dilutionCheckbox');
        const motherTinctureCheckbox = document.getElementById('motherTinctureCheckbox');
        const inventoryDiv = document.getElementById('inventoryDiv');
        const inventoryTable = document.getElementById('inventoryTable');

        // Show/Hide views based on checkbox status
        if (dilutionCheckbox.checked) {
            document.getElementById('dilutionView').classList.remove('hidden');
        } else {
            document.getElementById('dilutionView').classList.add('hidden');
            clearCategoryFromTable('Dilution');
        }

        if (motherTinctureCheckbox.checked) {
            document.getElementById('motherTinctureView').classList.remove('hidden');
        } else {
            document.getElementById('motherTinctureView').classList.add('hidden');
            clearCategoryFromTable('Mother Tincture');
        }

        // Show inventory table if at least one category is selected
        if (dilutionCheckbox.checked || motherTinctureCheckbox.checked) {
            inventoryDiv.classList.remove('hidden');
            inventoryTable.style.display = 'table';
        } else {
            inventoryDiv.classList.add('hidden');
            inventoryTable.style.display = 'none';
        }

        populateTable();
    }

    // Function to clear data from table for a specific category (Dilution or Mother Tincture)
    function clearCategoryFromTable(category) {
        const inventoryTableBody = document.getElementById('inventoryTableBody');
        const rowsToRemove = Array.from(inventoryTableBody.querySelectorAll(`tr[data-category="${category}"]`));
        rowsToRemove.forEach(row => inventoryTableBody.removeChild(row));
    }

    // Populate table based on selected packing sizes and categories
    function populateTable() {
        const selectedPackingSizesDilution = [];
        const selectedPackingSizesMT = [];

        // Collect selected packing sizes for Dilution
        document.querySelectorAll('#dilutionView input[type="checkbox"]:checked').forEach(checkbox => {
            const packingSize = checkbox.value;
            const company = checkbox.getAttribute('data-company');
            selectedPackingSizesDilution.push({ packingSize, company });
        });

        // Collect selected packing sizes for Mother Tincture
        document.querySelectorAll('#motherTinctureView input[type="checkbox"]:checked').forEach(checkbox => {
            const packingSize = checkbox.value;
            const company = checkbox.getAttribute('data-company');
            selectedPackingSizesMT.push({ packingSize, company });
        });

        // Clear table before populating
        const inventoryTableBody = document.getElementById('inventoryTableBody');
        inventoryTableBody.innerHTML = '';

        // Update table for Dilution
        const companiesDilution = [...new Set(selectedPackingSizesDilution.map(item => item.company))];
        companiesDilution.forEach(company => {
            const sizesForCompany = selectedPackingSizesDilution.filter(item => item.company === company).map(item => item.packingSize);
            updateInventoryTable(sizesForCompany, company, 'Dilution');
        });

        // Update table for Mother Tincture
        const companiesMT = [...new Set(selectedPackingSizesMT.map(item => item.company))];
        companiesMT.forEach(company => {
            const sizesForCompany = selectedPackingSizesMT.filter(item => item.company === company).map(item => item.packingSize);
            updateInventoryTable(sizesForCompany, company, 'Mother Tincture');
        });
    }

    // Edit medicine functionality
    function editMedicine(name, potency, packingSize) {
        const medicine = findMedicineByAttributes(name, potency, packingSize);
        const originalCount = medicine.count; // Save the original count

        // Create prompt to enter the new count
        const newCount = prompt(`Edit count for ${name} (${potency}, ${packingSize}). Original count: ${originalCount}`, originalCount);
        if (newCount !== null) {
            const updatedCount = parseInt(newCount, 10);
            if (!isNaN(updatedCount) && updatedCount >= 0) {
                medicine.count = updatedCount; // Update the count
                document.getElementById(`count-${name}-${potency}-${packingSize}`).innerText = medicine.count; // Update displayed count
                updateRowCategory(name, potency, packingSize); // Update row category based on new count
            } else {
                alert("Please enter a valid count (a non-negative number).");
            }
        }
    }


    // Event listeners for checkbox changes
    document.getElementById('dilutionCheckbox').addEventListener('change', handleCategoryCheckboxChange);
    document.getElementById('motherTinctureCheckbox').addEventListener('change', handleCategoryCheckboxChange);

    // Add event listeners for packing size checkboxes inside dilution and mother tincture views
    document.querySelectorAll('#dilutionView input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', populateTable);
    });

    document.querySelectorAll('#motherTinctureView input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', populateTable);
    });

    // Search function for inventory filtering
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const inventoryTableBody = document.getElementById('inventoryTableBody');
        const rows = inventoryTableBody.querySelectorAll('tr');

        // Split the query into individual terms
        const searchTerms = query.split(' ').filter(term => term);

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const medicineName = cells[0].textContent.toLowerCase(); // Medicine name
            const potency = cells[1].textContent.toLowerCase();     // Potency

            // Check if all search terms are present in the medicine name or potency
            const matches = searchTerms.every(term =>
                medicineName.includes(term) || potency.includes(term)
            );

            // Show or hide the row based on the matches
            row.style.display = matches ? '' : 'none';
        });
    });

    // Function to filter and show inventory based on stock status
    function filterInventory(status) {
        const inventoryTableBody = document.getElementById('inventoryTableBody');
        const rows = inventoryTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const count = Number(row.querySelector('span[id^="count-"]').innerText);
            switch (status) {
                case 'all':
                    row.style.display = ''; // Show all
                    break;
                case 'low':
                    row.style.display = (count > 0 && count <= 5) ? '' : 'none'; // Show low stock
                    break;
                case 'high':
                    row.style.display = (count > 5) ? '' : 'none'; // Show high stock
                    break;
                case 'out':
                    row.style.display = (count === 0) ? '' : 'none'; // Show out of stock
                    break;
            }
        });
    }

    // Event listeners for stock status buttons
    document.getElementById('showAll').addEventListener('click', () => filterInventory('all'));
    document.getElementById('showLowStock').addEventListener('click', () => filterInventory('low'));
    document.getElementById('showHighStock').addEventListener('click', () => filterInventory('high'));
    document.getElementById('showOutOfStock').addEventListener('click', () => filterInventory('out'));

    // Function to set the active state on buttons
    function setActiveButton(button) {
        // Remove 'active' class from all buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Add 'active' class to the clicked button
        button.classList.add('active');
    }

    // Example usage in event listeners
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function () {
            setActiveButton(this);
        });
    });

    // Call this function on page load to ensure the proper view is displayed
    handleCategoryCheckboxChange();
});
