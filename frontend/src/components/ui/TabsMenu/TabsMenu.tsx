import { ReactNode, useState } from "react";
import { Button } from "../";
import styles from './TabsMenu.module.css';

interface TabsContent {
    [key: string]: {
        label: string;
        content: ReactNode;
    }
}

interface TabsProps {
    tabs: TabsContent;
    defaultTab?: string;
    testId?: string;
}

const TabsMenu = ({ tabs, defaultTab, testId }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab || Object.keys(tabs)[0]);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    }

    const tabsElements = Object.entries(tabs).map(([tabId, tab]) => (
        <Button
            key={tabId}
            className={`${styles.tabButton} ${activeTab === tabId ? styles.active : ''}`}
            onClick={() => handleTabClick(tabId)}
        >
            {tab.label}
        </Button>
    ))

    const tabContent = tabs[activeTab]?.content || null;

    return (
        <div className={styles.tabsContainer} data-testid={testId}>
            <div className={styles.tabList}>
                {tabsElements}
            </div>
            <div className={styles.tabContent}>
                {tabContent}
            </div>
        </div>
    );
};

export default TabsMenu;