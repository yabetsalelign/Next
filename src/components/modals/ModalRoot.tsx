'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { HelpMeStartModal } from './HelpMeStartModal';
import { ImStuckModal } from './ImStuckModal';
import { TaskBreakdownModal } from './TaskBreakdownModal';
import { BodyEnvCheckModal } from './BodyEnvCheckModal';
import { TaskCreatorModal } from './TaskCreatorModal';
import { RoutineRunnerModal } from './RoutineRunnerModal';
import { FreshStartModal } from './FreshStartModal';
import { JournalModal } from './JournalModal';
import { CheckInModal } from './CheckInModal';

export function ModalRoot() {
  const { activeModal } = useApp();

  if (!activeModal) return null;

  switch (activeModal) {
    case 'help_start':
      return <HelpMeStartModal />;
    case 'stuck':
      return <ImStuckModal />;
    case 'breakdown':
      return <TaskBreakdownModal />;
    case 'body_check':
      return <BodyEnvCheckModal />;
    case 'create_task':
      return <TaskCreatorModal />;
    case 'routine_runner':
      return <RoutineRunnerModal />;
    case 'fresh_start':
      return <FreshStartModal />;
    case 'journal':
      return <JournalModal />;
    case 'check_in':
      return <CheckInModal />;
    default:
      return null;
  }
}
