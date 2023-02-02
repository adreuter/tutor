class W { public:
  int w; virtual void f(int);
  virtual void g(int);
  virtual void h(int);
};
class A : public virtual W { public:
  int a; void f(int);
};
class B : public virtual W { public:
  int b; void g(int);
};
class C : public A, public B { public:
  int c; void h(int);
};

int main(int argc, char **argv) {
C* pc;
pc->B::f(42);
((W*)pc)->h(42);
((B*)pc)->f(42);

return 0;
}
