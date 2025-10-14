"use client";
import InputCustom from "@/components/ui/InputCustom/InputCustom";
import DatePickerCustom from "@/components/ui/Date/DatePickerCustom";
import TimePickerCustom from "@/components/ui/Date/TimePickerCustom";
import TableCustom from "@/components/ui/TableCustom";
import SelectCustom from "@/components/ui/Select/SelectCustom";
import { useState } from "react";
import TreeSelectCustom from "@/components/ui/Select/TreeSelectCustom";
import FloatingInput from "@/components/ui/Floating/FloatingInput";
import { Col, Row } from "antd";

const columns = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Tuổi",
    dataIndex: "age",
    key: "age",
  },
];

const data = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    age: 25,
  },
  {
    key: "2",
    name: "Trần Thị B",
    age: 30,
  },
];

const options = [
  { value: "apple", label: "Táo" },
  { value: "banana", label: "Chuối" },
  { value: "orange", label: "Cam" },
];

const treeData = [
  {
    title: "Trái cây",
    value: "fruits",
    children: [
      { title: "Táo", value: "apple" },
      { title: "Chuối", value: "banana" },
    ],
  },
  {
    title: "Rau củ",
    value: "vegetables",
    children: [
      { title: "Cà rốt", value: "carrot" },
      { title: "Khoai tây", value: "potato" },
    ],
  },
];

export default function Home() {
  const [value, setValue] = useState();
  const [valueTree, setValueTree] = useState();

  return (
    <div className="h-[1000px]">
      <h1 className="text-[100px]">Home</h1>
      <h5>Input custom</h5>
      <span>
        <InputCustom type="number" label="Nhap" />
      </span>
      <h5>Date Picker</h5>
      <DatePickerCustom />

      <h5>Time Picker</h5>
      <TimePickerCustom />
      <h5>TableCustom</h5>
      <TableCustom
        columns={columns}
        dataSource={data}
        textEmpty="Không có dữ liệu hiển thị"
        isPrimary={true}
        isStickyScrroll={true}
      />

      <h5>Select Custom</h5>
      <SelectCustom
        options={options}
        value={value}
        onChange={setValue}
        placeholder="Chọn loại trái cây"
      />
      <Row gutter={16}>
        <Col span={12}>
          <h5>TreeSelect</h5>
          <TreeSelectCustom
            treeData={treeData}
            value={value}
            onChange={setValue}
            placeholder="Chọn loại thực phẩm"
            allowClear
            treeDefaultExpandAll
          />
        </Col>
        <Col span={4}>
          <h5>Input Floating</h5>
          <FloatingInput
            label="Tên đăng nhập"
            value={value}
            placeholder="Nhập tên đăng nhập"
            required
          />
        </Col>
      </Row>
    </div>
  );
}
