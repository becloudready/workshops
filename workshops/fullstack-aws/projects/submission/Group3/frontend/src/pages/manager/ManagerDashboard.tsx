import { useState } from 'react'
import type { ReactNode } from 'react'
import Layout from '../../components/Layout'
import { useAuth } from '../../auth/useAuth'
import TraineesPanel from './TraineesPanel'
import CoursesPanel from './CoursesPanel'
import CreatePanel from './CreatePanel'
import {
  DashboardWrap,
  DashboardLayout,
  Sidebar,
  SidebarEyebrow,
  SidebarTitle,
  SidebarNav,
  SidebarNavButton,
  SidebarFooter,
  Avatar,
  SidebarUserInfo,
  SidebarUserName,
  SidebarUserRole,
  MainArea,
  MainHeader,
  MainTitle,
  MainSubtitle,
} from './ManagerDashboard.styled'

type ManagerTab = 'trainees' | 'courses' | 'create'

const TABS: { value: ManagerTab; label: string; icon: ReactNode }[] = [
  {
    value: 'trainees',
    label: 'Trainees',
    icon: (
      <svg viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path
          d="M7.5 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-5 10c0-2.21 2.239-4 5-4s5 1.79 5 4v.5H2.5V11z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    value: 'courses',
    label: 'Courses & Assignments',
    icon: (
      <svg viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path
          d="M2 3.5A1.5 1.5 0 0 1 3.5 2h8A1.5 1.5 0 0 1 13 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 2 12.5v-9zm1.5-.5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8zM5 6.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    value: 'create',
    label: 'Create',
    icon: (
      <svg viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path
          d="M7.5 1a.5.5 0 0 1 .5.5V7h5.5a.5.5 0 0 1 0 1H8v5.5a.5.5 0 0 1-1 0V8H1.5a.5.5 0 0 1 0-1H7V1.5a.5.5 0 0 1 .5-.5z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

const TITLES: Record<ManagerTab, string> = {
  trainees: 'Trainees',
  courses: 'Courses & Assignments',
  create: 'Create',
}

const SUBTITLES: Record<ManagerTab, string> = {
  trainees: 'View trainee profiles and their training progress.',
  courses: 'Browse all training plans and their attached assignments.',
  create: 'Build training plans, define assignments, and enroll trainees.',
}

function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState<ManagerTab>('trainees')
  const { user } = useAuth()
  const initials = (user?.username ?? 'TM').slice(0, 2).toUpperCase()

  return (
    <Layout>
      <DashboardWrap>
        <DashboardLayout>
          <Sidebar>
            <div>
              <SidebarEyebrow>Manager</SidebarEyebrow>
              <SidebarTitle>Dashboard</SidebarTitle>
            </div>

            <SidebarNav aria-label="Manager sections">
              {TABS.map((tab) => (
                <SidebarNavButton
                  key={tab.value}
                  type="button"
                  $active={activeTab === tab.value}
                  aria-current={activeTab === tab.value ? 'page' : undefined}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.icon}
                  {tab.label}
                </SidebarNavButton>
              ))}
            </SidebarNav>

            <SidebarFooter>
              <Avatar aria-hidden="true">{initials}</Avatar>
              <SidebarUserInfo>
                <SidebarUserName>{user?.username ?? 'Training Manager'}</SidebarUserName>
                <SidebarUserRole>Training Manager</SidebarUserRole>
              </SidebarUserInfo>
            </SidebarFooter>
          </Sidebar>

          <MainHeader>
            <MainTitle>{TITLES[activeTab]}</MainTitle>
            <MainSubtitle>{SUBTITLES[activeTab]}</MainSubtitle>
          </MainHeader>

          <MainArea>
            {activeTab === 'trainees' && <TraineesPanel />}
            {activeTab === 'courses' && <CoursesPanel />}
            {activeTab === 'create' && <CreatePanel />}
          </MainArea>
        </DashboardLayout>
      </DashboardWrap>
    </Layout>
  )
}

export default ManagerDashboard
