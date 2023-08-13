import * as Filter from '../../public/module/filter.js';


test("Filter-New", () => {
    const tcs  = [
        {
            name: "empty array, no filter",
            list: [],
            filters: [],
            want: [],
        },
        {
            name: "empty array, with filter",
            list: [],
            filters: [n => n<10],
            want: [],
        },
        {
            name: "non empty array, no filter",
            list: [5],
            filters: [],
            want: [5],
        },
        {
            name: "1 element, 1 filter",
            list: [12],
            filters: [n => n<10],
            want: [],
        },
        {
            name: "1 element, multiple filters",
            list: [12],
            filters: [n => n>5, n => n>8],
            want: [12],
        },
        {
            name: "multiple elements, 1 filter",
            list: [12, 5, 3, 4],
            filters: [n => n<10],
            want: [5, 3, 4],
        },
        {
            name: "multiple elements, multiple filters",
            list: [12, 30, 24, 15, 6, 8, 17, 21, 31],
            filters: [n => n>15, n => n<30, n => n>20],
            want: [24, 21],
        },
    ];

    for(const tc of tcs) {
        const get = Filter.New(tc.list, ...tc.filters)();
        expect(get).toEqual(tc.want);
    }
})
