class A { public:
int a; virtual int f(int);
};
class B { public:
int b; virtual int f(int);
virtual int g(int);
};
class C : public A , public B { public:
int c; virtual int f(int);
};
int main(int argc, char **argv) {
C c;
B* pb = &c;
pb->f(42);
return 0;
}
