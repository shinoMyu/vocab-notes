import { Typography, Empty } from 'antd';

const { Title, Text } = Typography;

function Grammar() {
  return (
    <div className="page-container">
      <Title level={2}>文法筆記</Title>
      <Text type="secondary">
        記錄文法概念、例句、標籤與相關單字。
      </Text>
      <Empty
        description="文法筆記功能即將建立"
        style={{ marginTop: 80 }}
      />
    </div>
  );
}

export default Grammar;
