interface Vehicle {
    name: string;
    licensePlate: string;
    entry: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTime(mili: number) {
        const min = Math.floor(mili / 60000);
        const sec = Math.floor((mili % 60000) / 1000);

        return `${min}m : ${sec}s`;
    }

    function garage() {
        function read(): Vehicle[] {
            return localStorage.garage ? JSON.parse(localStorage.garage) : [];
        }

        function save(vehicles: Vehicle[]) {
            localStorage.setItem("garage", JSON.stringify(vehicles));
        }

        function add(vehicle: Vehicle, saved?: boolean) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${vehicle.name}</td>
                <td>${vehicle.licensePlate}</td>
                <td>${vehicle.entry}</td>
                <td>
                    <button class="delete" data-license-plate="${vehicle.licensePlate}">X</button>
                </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function () {
                remove(this.dataset.licensePlate)
            });

            $("#garage")?.appendChild(row);

            if (saved) {
                save([...read(), vehicle]);
            }
        }

        function remove(licensePlate: string) {
            const { entry, name } = read().find(vehicle => vehicle.licensePlate === licensePlate);

            const time = calcTime(new Date().getTime() - new Date(entry).getTime());

            if (!confirm(`The vehicle ${name} remained for ${time}. Do you want to leave?`)) return;

            save(read().filter(vehicle => vehicle.licensePlate !== licensePlate));

            render();
        }

        function render() {
            $("#garage")!.innerHTML = "";
            const garage = read();

            if (garage.length) {
                garage.forEach((vehicle) => add(vehicle));
            }
        }

        return { read, add, remove, save, render };
    }

    garage().render();

    $("#register")?.addEventListener("click", () => {
        const name = $("#name")?.value;
        const licensePlate = $("#license-plate")?.value;

        if (!name || !licensePlate) {
            alert("The name and license plate fields are required!");
            return;
        }

        garage().add({ name, licensePlate, entry: new Date().toISOString() }, true)
    })
})();