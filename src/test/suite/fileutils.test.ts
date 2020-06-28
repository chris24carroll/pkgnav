import * as assert from 'assert';
import { fileInfo } from '../../fileutils';

suite('fileutils Test Suite', () => {

  test("fileInfo", () => {
    const fi = fileInfo(
      "/a/b/c",
      "src/main/scala",
      "/a/b/c/someModule/src/main/scala/com/example/Main.scala",
      '.'
    );
    assert(!fi.isEmpty());
    fi.forEach(f => {
      assert(f.name === "Main");
      assert(f.package === "com.example");
      assert(f.module === "someModule");
    });
  });
});
