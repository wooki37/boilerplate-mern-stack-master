import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

function LeftMenu({ mode }) {
  const items = [
    { key: 'mail', label: <a href="/">Home</a> },
    {
      key: 'blogs',
      label: 'Blogs',
      children: [
        {
          type: 'grp1',
          label: 'Item 1',
          children: [
            { key: 'setting:1', label: 'Option 1' },
            { key: 'setting:2', label: 'Option 2' },
          ],
        },
        {
          type: 'grp2',
          label: 'Item 2',
          children: [
            { key: 'setting:3', label: 'Option 3' },
            { key: 'setting:4', label: 'Option 4' },
          ],
        },
      ],
    },
  ];

  return <Menu mode={mode} items={items} />;
}

// const { SubMenu, ItemGroup } = Menu; // v5에서도 여전히 제공됩니다.

// function LeftMenu({ mode }) {
//   return (
//     <Menu mode={mode}>
//       <Menu.Item key="home">
//         <Link to="/">Home</Link>
//       </Menu.Item>

//       <SubMenu key="blogs" title={<span>Blogs</span>}>
//         <ItemGroup key="grp1" title="Item 1">
//           <Menu.Item key="setting:1">Option 1</Menu.Item>
//           <Menu.Item key="setting:2">Option 2</Menu.Item>
//         </ItemGroup>
//         <ItemGroup key="grp2" title="Item 2">
//           <Menu.Item key="setting:3">Option 3</Menu.Item>
//           <Menu.Item key="setting:4">Option 4</Menu.Item>
//         </ItemGroup>
//       </SubMenu>
//     </Menu>
//   );
// }

export default LeftMenu;
