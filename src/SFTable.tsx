import React from "react"
import {
	DetailsList,
	IColumn,
	ScrollablePane,
	ScrollbarVisibility,
	SelectionMode,
	Stack,
	Text,
} from "@fluentui/react"
import { TableFilter } from "./TableFilter"
import { ISFTableProps, DropdownData } from "./types"

export const SFTable = <T extends object>(
	props: ISFTableProps<T>
): JSX.Element => {
	const table_columns: IColumn[] = props.columns.map(
		(value: IColumn) => {
			return {
				...value,
				onColumnClick: (
					_ev: React.MouseEvent<HTMLElement>,
					_column: IColumn
				) => null,
			}
		}
	)

	const compare = (
		a: any,
		b: any,
		key: string,
		isSortedDescending: boolean
	): number => {
		return (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
	}

	const onColumnClick = (
		_ev: React.MouseEvent<HTMLElement, MouseEvent>,
		column: IColumn
	) => {
		const newColumns: IColumn[] = columns.slice()
		const currColumn: IColumn = newColumns.filter(
			(currCol) => column.key === currCol.key
		)[0]
		newColumns.forEach((newCol: IColumn) => {
			if (newCol === currColumn) {
				currColumn.isSortedDescending = !currColumn.isSortedDescending
				currColumn.isSorted = true
			} else {
				newCol.isSorted = false
				newCol.isSortedDescending = true
			}
		})
		setColumns(newColumns) //set the sorting icon for the relevant columns

		const newItems = items.sort((a, b) =>
			compare(a, b, currColumn.key, currColumn.isSortedDescending!)
		)
		setItems(newItems)
	}


	const dropdownFilterValues: {
		[key: string]: {[name: string]: DropdownData}
	} = {}
	props.dropdownFilterProps.forEach((entry) => {
		let opt = Object.fromEntries(entry.options.map((e) => [e.key, e.data]))
		dropdownFilterValues[entry.name] = opt
	})

	const dropdownFilterKeys: {
		[key: string]: string[] | number[]
	} = {}
	props.dropdownFilterProps.forEach((entry) => {
		let opt = entry.options
		opt = opt.filter((e) => e.selected)
		const opt2 = opt.map((e) => e.key)
		dropdownFilterKeys[entry.name] = opt2 as string[] | number[]
	})

	table_columns.forEach((col: IColumn) => {
		col.onColumnClick = onColumnClick
	})

	const textFilterValues: { [key: string]: string } = {}
	props.textFilterProps.forEach((entry) => {
		textFilterValues[entry.name] = entry.startingValue
	})
	
	

	//const dropdownFilterValues: {
	//	[key: string]: IDropdownOption[]
	//} = Object.fromEntries(
	//	Object.keys(props.dropdownFilterProps).map((index, key) => {
	// Need to iterate over?
	//		const opt: IDropdownOption = {
	//			data: props.dropdownFilterProps[key].startingValue,
	//			key: key,
	//			text: String(key),
	//		}
	//		return [key, opt]
	//	})
	//)

	const [columns, setColumns] = React.useState<IColumn[]>(table_columns)
	const [items, setItems] = React.useState(props.items)
	const [dropdownFilters, setDropdownFilters] =
		React.useState(dropdownFilterKeys)
	const [textFilters, setTextFilters] = React.useState(textFilterValues)

	React.useEffect(() => {
		const dropdownFiltersValuesCurrent: {[key: string]: DropdownData[]} = {}

		for (const [key, value] of Object.entries(dropdownFilters)) {
			dropdownFiltersValuesCurrent[key] = value.map((e) => dropdownFilterValues[key][e])
		}

		//Logic of filtering
		if (
			Math.max(
				...Object.values(dropdownFiltersValuesCurrent).map((entry) => entry.length)
			) === 0 &&
			Math.max(
				...Object.values(textFilters).map((entry) => entry.length)
			) === 0
		) {
			//no filters , show all the items
			setItems(props.items)
			return
		}
		let output: T[] = [...props.items]

		for (const [key, value] of Object.entries(dropdownFiltersValuesCurrent)) {
			if (value.length > 0) {
				output = output.filter((item) => {
					return value.includes(
						item[key as keyof typeof item] as never
					)
				})
			}
		}
		for (const [key, value] of Object.entries(textFilters)) {
			if (value.length > 0) {
				output = output.filter((item) =>
					(item as any)[key]
						.toLowerCase()
						.includes(value.toLowerCase())
				)
			}
		}
		setItems(output)
	}, [dropdownFilters, textFilters, columns])

	const dropdownProps = props.dropdownFilterProps.map((entry) => {
		return {
			label: entry.label,
			selectedKeys: dropdownFilters[entry.name],
			setSelectedKeys: (values: string[] | number[]) => {
				setDropdownFilters({
					...dropdownFilters,
					[entry.name]: values,
				})
			},
			options: entry.options,
		}
	})

	const textProps = props.textFilterProps.map((entry) => {
		return {
			label: entry.label,
			value: (textFilters as any)[entry.name],
			updateValue: (value: string) => {
				setTextFilters({ ...textFilters, [entry.name]: value })
			},
		}
	})

	return (
		<Stack grow verticalFill styles={{ root: { height: "80vh" } }}>
			<Stack.Item>
				<TableFilter
					dropdownProps={dropdownProps}
					textProps={textProps}
				/>
			</Stack.Item>
			<Stack.Item
				grow
				styles={{ root: { marginTop: 0, position: "relative" } }}
			>
				<ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
					{props.items.length > 0 && (
						<DetailsList
							styles={{ root: { padding: 10 } }}
							selectionMode={SelectionMode.none}
							items={items}
							columns={columns}
						/>
					)}
					{props.items.length === 0 && (
						<Text>
							There are no items to render, please try changing
							filters
						</Text>
					)}
				</ScrollablePane>
			</Stack.Item>
		</Stack>
	)
}
