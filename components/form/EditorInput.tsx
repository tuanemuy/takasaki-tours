"use client";

import { useState, useRef } from "react";

import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Flex, Box } from "@/styled-system/jsx";
import { Switch } from "@/components/ui/switch";

type Props = {
  height: string;
  defaultLanguage?: string;
  defaultValue?: string;
  value?: string;
  // biome-ignore lint/suspicious/noExplicitAny:
  onChange: (value: string | undefined, event: any) => void;
};

export function EditorInput({
  height,
  defaultLanguage,
  defaultValue,
  value,
  onChange,
}: Props) {
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny:
  const VimMode = useRef<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny:
  const makeDomStatusBar = useRef<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny:
  const vimModeRef = useRef<any>(null);
  const [isVimMode, setIsVimMode] = useState(false);

  return (
    <>
      <Box
        border="1px solid token(colors.border.subtle)"
        borderRadius="md"
        overflow="hidden"
        css={{
          "& *": {
            fontFamily: "Menlo, Monaco, 'Courier New', monospace !important",
            fontSize: "12px !important",
          },
        }}
      >
        <Editor
          height={height}
          defaultLanguage={defaultLanguage}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          onMount={async (editor) => {
            editorRef.current = editor;
            // @ts-ignore
            VimMode.current = (await import("vim-monaco")).VimMode;
            makeDomStatusBar.current = // @ts-ignore
              (await import("vim-monaco")).makeDomStatusBar;
            if (statusRef.current) {
              const statusBar = makeDomStatusBar.current(
                statusRef.current,
                () => editor.focus(),
              );
              vimModeRef.current = new VimMode.current(editor, statusBar);
            }
          }}
          options={{
            formatOnPaste: true,
            fontFamily: "monospace",
            lineNumbersMinChars: 3,
            tabSize: 2,
            minimap: {
              enabled: false,
            },
          }}
        />
      </Box>

      <Flex mt="2" justifyContent="space-between" alignItems="center" gap="2">
        <Switch
          checked={isVimMode}
          onCheckedChange={(_checked) => {
            if (!vimModeRef.current || !editorRef.current) {
              setIsVimMode(false);
              return;
            }

            if (!isVimMode) {
              vimModeRef.current.enable();
              setIsVimMode(true);
            } else {
              vimModeRef.current.disable();
              setIsVimMode(false);
            }
          }}
        >
          Vim
        </Switch>

        <Box fontSize="0.8rem">
          <div ref={statusRef} />
        </Box>
      </Flex>
    </>
  );
}
