'use client';

import clsx from 'clsx';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { navItems } from '../config/sidebar';

// 动画变体定义
const sectionVariants: Variants = {
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

// 子项动画变体
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.2 },
  }),
};

// 导航链接组件
const NavLink = ({
  href,
  children,
  isActive,
  isSubItem = false,
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  isSubItem?: boolean;
}) => {
  return (
    <Link href={href} className="block w-full">
      <span
        className={`transition-all duration-300 ${
          isSubItem && `text-sm md:text-base font-bold text-white`
        }`}
      >
        {children}
      </span>
    </Link>
  );
};

// 侧边栏导航组件
export default function SidebarNav() {
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const router = useRouter();

  // 自动展开当前活动分类
  const getActiveSection = () => {
    if (expandedSection) return expandedSection;

    // 查找包含当前路径的分类
    const currentSection = navItems.find((section) =>
      section.items.some((item) => item.href && pathname.startsWith(item.href))
    );

    return currentSection?.label || null;
  };

  // 检查链接是否为活动状态
  const isLinkActive = (href: string) => {
    return pathname.startsWith(href);
  };

  // 切换分类展开状态并跳转到第一个子项目
  const toggleSection = (label: string) => {
    // 如果当前section未展开，则展开它并导航到第一个子项目
    if (expandedSection !== label) {
      setExpandedSection(label);

      // 找到该分类下的第一个子项目并导航
      const section = navItems.find((item) => item.label === label);
      if (section && section.items.length > 0) {
        const firstItem = section.items[0];
        if (firstItem.href) {
          router.push(firstItem.href);
        }
      }
    } else {
      // 如果当前section已展开，则折叠它
      setExpandedSection(null);
    }
  };

  const activeSection = getActiveSection();

  return (
    <nav className="flex flex-col h-full ">
      {navItems.map((section) => {
        const isExpanded = section.label === activeSection;

        return (
          <div
            key={section.label}
            className={clsx(
              'w-full text-left focus:outline-none border-y  py-2 flex flex-col justify-between',
              isExpanded ? 'border-white flex-1' : 'border-white/20'
            )}
          >
            {/* 分类标题 */}
            <motion.button
              className={clsx('w-full text-left focus:outline-none py-2 ')}
              onClick={() => toggleSection(section.label)}
              initial="initial"
              whileHover="hover"
              animate="initial"
              transition={{ duration: 0.2 }}
              variants={{
                initial: {},
                hover: {
                  x: 5,
                },
              }}
            >
              <motion.span
                className={`font-roboto font-black transition-all duration-300 text-xl md:text-2xl ${
                  isExpanded ? 'text-white' : 'text-white/50'
                }`}
                variants={{
                  initial: {
                    color: isExpanded ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  },
                  hover: {
                    color: 'white',
                  },
                }}
              >
                {section.label}
              </motion.span>
            </motion.button>

            {/* 子项目列表 */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={sectionVariants}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-4  py-2">
                    {section.items
                      .filter((item) => item.href)
                      .map((item, index) => (
                        <motion.div
                          key={item.href}
                          custom={index}
                          initial="hidden"
                          animate="visible"
                          variants={itemVariants}
                          className="flex items-center gap-2"
                        >
                          <div className="min-w-[10px] flex items-center">
                            {isLinkActive(item.href) && (
                              <div className="w-[8px] h-[8px] bg-white rounded-full" />
                            )}
                          </div>
                          <NavLink
                            href={item.href}
                            isActive={isLinkActive(item.href)}
                            isSubItem={true}
                          >
                            {item.label}
                          </NavLink>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}
